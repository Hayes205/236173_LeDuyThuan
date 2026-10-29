import { useCallback, useEffect, useState } from "react";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const EMPTY_FORM = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

async function requestAPI(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || result.error || `Lỗi HTTP ${response.status}`
    );
  }

  return result;
}

function getFoodUrl(id) {
  return `${API_URL}/foods/${encodeURIComponent(id)}`;
}

function getFoodId(food) {
  // Ưu tiên foodId do người dùng khai báo.
  // Nếu không có thì sử dụng MongoDB _id.
  return food.foodId || food._id;
}

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadFoods = useCallback(async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (keyword.trim()) {
        params.set("search", keyword.trim());
      }

      const query = params.toString();
      const url = `${API_URL}/foods${query ? `?${query}` : ""}`;
      const result = await requestAPI(url);

      setFoods(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(`Không thể tải danh sách món ăn: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(food) {
    setEditingId(getFoodId(food));

    setForm({
      foodId: food.foodId || "",
      name: food.name || "",
      category: food.category || "",
      cuisine: food.cuisine || "",
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : "",
      price: food.price ?? "",
      quantity: food.quantity ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
    });

    setNotice("");
    setError("");
    setSelectedFood(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !form.foodId.trim() ||
      !form.name.trim() ||
      !form.category.trim() ||
      !form.cuisine.trim() ||
      !form.description.trim()
    ) {
      setError("Vui lòng nhập đầy đủ mã, tên, loại, ẩm thực và mô tả.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      form.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError("Giá phải là số không âm và số lượng phải là số nguyên không âm.");
      return;
    }

    const ingredients = form.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      setError("Vui lòng nhập ít nhất một nguyên liệu.");
      return;
    }

    const payload = {
      foodId: form.foodId.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients,
      price,
      quantity,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        // Không gửi foodId khi cập nhật để tránh thay đổi mã món ăn.
        const { foodId, ...updatePayload } = payload;

        await requestAPI(getFoodUrl(editingId), {
          method: "PUT",
          body: JSON.stringify(updatePayload),
        });

        setNotice("Cập nhật món ăn thành công!");
      } else {
        await requestAPI(`${API_URL}/foods`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setNotice("Thêm món ăn thành công!");
      }

      resetForm();
      await loadFoods(search);
    } catch (err) {
      setError(`Thao tác thất bại: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(food) {
    const id = getFoodId(food);

    if (!window.confirm(`Bạn có chắc muốn xóa món "${food.name}" không?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await requestAPI(getFoodUrl(id), {
        method: "DELETE",
      });

      setNotice(`Đã xóa món "${food.name}" thành công.`);
      setSelectedFood(null);

      if (editingId === id) {
        resetForm();
      }

      await loadFoods(search);
    } catch (err) {
      setError(`Không thể xóa món ăn: ${err.message}`);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    setSelectedFood(null);
    await loadFoods(search);
  }

  async function showDetails(food) {
    setError("");
    setNotice("");

    try {
      const result = await requestAPI(getFoodUrl(getFoodId(food)));
      setSelectedFood(result.data);
    } catch (err) {
      setError(`Không thể xem chi tiết: ${err.message}`);
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price ?? 0);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container header-content">
          <a className="brand" href="#">
            <span className="brand-icon">🍜</span>
            <span>FoodManager</span>
          </a>
          <span className="header-label">HỆ THỐNG QUẢN LÝ MÓN ĂN</span>
        </div>
      </header>

      <main className="container main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">FOOD MANAGEMENT SYSTEM</p>
            <h1>Quản lý món ăn</h1>
            <p className="hero-description">
              Quản lý danh sách món ăn, giá bán và số lượng trên một giao diện.
            </p>
          </div>

          <div className="stats-card">
            <span>Tổng số món ăn</span>
            <strong>{foods.length}</strong>
            <small>Món ăn trong kết quả hiện tại</small>
          </div>
        </section>

        {notice && (
          <div className="alert success" role="status">
            <span>✓</span>
            {notice}
            <button onClick={() => setNotice("")} aria-label="Đóng thông báo">
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="alert error" role="alert">
            <span>!</span>
            {error}
            <button onClick={() => setError("")} aria-label="Đóng thông báo">
              ×
            </button>
          </div>
        )}

        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{editingId ? "EDIT FOOD" : "NEW FOOD"}</p>
              <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn mới"}</h2>
            </div>

            {editingId && (
              <button className="btn btn-light" onClick={resetForm}>
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Mã món ăn *
                <input
                  name="foodId"
                  value={form.foodId}
                  onChange={handleChange}
                  placeholder="Ví dụ: FOOD001"
                  required
                  disabled={Boolean(editingId)}
                />
              </label>

              <label>
                Tên món ăn *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Phở bò"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Loại món ăn *
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Ví dụ: Món nước"
                  required
                />
              </label>

              <label>
                Vùng miền / Ẩm thực *
                <input
                  name="cuisine"
                  value={form.cuisine}
                  onChange={handleChange}
                  placeholder="Ví dụ: Việt Nam"
                  required
                />
              </label>

              <label>
                Giá bán (VNĐ) *
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                />
              </label>

              <label>
                Số lượng *
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="20"
                  required
                />
              </label>

              <label className="full-width">
                Nguyên liệu *
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Bánh phở, Thịt bò, Hành, Nước dùng"
                  required
                />
                <small>Phân cách các nguyên liệu bằng dấu phẩy.</small>
              </label>

              <label className="full-width">
                Đường dẫn hình ảnh
                <input
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </label>

              <label className="full-width">
                Mô tả *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả món ăn..."
                  rows="3"
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" disabled={saving}>
                {saving
                  ? "Đang lưu..."
                  : editingId
                    ? "Lưu cập nhật"
                    : "＋ Thêm món ăn"}
              </button>

              {!editingId && (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={resetForm}
                >
                  Xóa nội dung
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FOOD INVENTORY</p>
              <h2>Danh sách món ăn</h2>
            </div>

            <button
              className="btn btn-light"
              onClick={() => loadFoods(search)}
              disabled={loading}
            >
              ↻ Làm mới
            </button>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <span className="search-icon">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên, loại món hoặc vùng miền..."
              aria-label="Từ khóa tìm kiếm"
            />

            <button className="btn btn-primary" disabled={loading}>
              Tìm kiếm
            </button>
          </form>

          {loading ? (
            <div className="state-message">
              <span className="spinner" />
              <p>Đang tải danh sách món ăn...</p>
            </div>
          ) : error && foods.length === 0 ? (
            <div className="state-message">
              <span className="state-icon">!</span>
              <h3>Không thể tải dữ liệu</h3>
              <p>Kiểm tra backend, địa chỉ API và kết nối MongoDB.</p>
              <button
                className="btn btn-primary"
                onClick={() => loadFoods(search)}
              >
                Thử lại
              </button>
            </div>
          ) : foods.length === 0 ? (
            <div className="state-message">
              <span className="state-icon">🍽</span>
              <h3>Chưa có món ăn nào</h3>
              <p>Thêm món ăn mới hoặc thử một từ khóa khác.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Món ăn</th>
                    <th>Phân loại</th>
                    <th>Ẩm thực</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {foods.map((food) => (
                    <tr key={food._id || food.foodId}>
                      <td>
                        <div className="food-name-cell">
                          {food.imageUrl ? (
                            <img
                              className="food-thumb"
                              src={food.imageUrl}
                              alt={food.name}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="food-placeholder">🍲</div>
                          )}

                          <div>
                            <strong>{food.name}</strong>
                            <small>{food.foodId}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge">{food.category}</span>
                      </td>

                      <td>{food.cuisine}</td>

                      <td className="price">
                        {formatPrice(food.price)}
                      </td>

                      <td>{food.quantity}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => showDetails(food)}
                            title="Xem chi tiết"
                          >
                            Xem
                          </button>

                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(food)}
                            title="Cập nhật"
                          >
                            Sửa
                          </button>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(food)}
                            title="Xóa"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="list-footer">
            <span>Hiển thị {foods.length} món ăn</span>
            <span>FoodManager · React + Express + MongoDB</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          Bài thực hành Điện toán đám mây · Quản lý món ăn
        </div>
      </footer>

      {selectedFood && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedFood(null)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">FOOD DETAILS</p>
                <h2 id="detail-title">Chi tiết món ăn</h2>
              </div>

              <button
                className="close-btn"
                onClick={() => setSelectedFood(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            {selectedFood.imageUrl && (
              <img
                className="detail-image"
                src={selectedFood.imageUrl}
                alt={selectedFood.name}
              />
            )}

            <h3>{selectedFood.name}</h3>

            <div className="detail-grid">
              <div>
                <span>Mã món</span>
                <strong>{selectedFood.foodId || "—"}</strong>
              </div>
              <div>
                <span>Loại món</span>
                <strong>{selectedFood.category}</strong>
              </div>
              <div>
                <span>Ẩm thực</span>
                <strong>{selectedFood.cuisine}</strong>
              </div>
              <div>
                <span>Giá bán</span>
                <strong>{formatPrice(selectedFood.price)}</strong>
              </div>
              <div>
                <span>Số lượng</span>
                <strong>{selectedFood.quantity}</strong>
              </div>
              <div className="full-width">
                <span>Nguyên liệu</span>
                <strong>
                  {Array.isArray(selectedFood.ingredients)
                    ? selectedFood.ingredients.join(", ")
                    : "—"}
                </strong>
              </div>
              <div className="full-width">
                <span>Mô tả</span>
                <p>{selectedFood.description || "Chưa có mô tả."}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-light"
                onClick={() => setSelectedFood(null)}
              >
                Đóng
              </button>

              <button
                className="btn btn-primary"
                onClick={() => startEdit(selectedFood)}
              >
                Chỉnh sửa món ăn
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;