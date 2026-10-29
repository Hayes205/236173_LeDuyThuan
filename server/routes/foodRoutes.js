const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/Food");

const router = express.Router();

// Kiểm tra chuỗi tìm kiếm trước khi sử dụng RegExp
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Cho phép tìm món ăn bằng MongoDB _id hoặc foodId
function getFoodFilter(id) {
  if (mongoose.isValidObjectId(id)) {
    return {
      $or: [{ _id: id }, { foodId: id }],
    };
  }

  return { foodId: id };
}

// Xử lý lỗi validation và lỗi trùng khóa
function handleRouteError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Mã món ăn foodId đã tồn tại",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      error: error.message,
    });
  }

  console.error("API error:", error.message);

  return res.status(500).json({
    success: false,
    message: "Lỗi máy chủ khi xử lý yêu cầu",
  });
}

// GET /api/foods?search=pho
// GET /api/foods
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search !== undefined) {
      if (typeof search !== "string") {
        return res.status(400).json({
          success: false,
          message: "Từ khóa tìm kiếm phải là chuỗi",
        });
      }

      const keyword = search.trim();

      if (keyword.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Từ khóa tìm kiếm không được vượt quá 100 ký tự",
        });
      }

      if (keyword) {
        const regex = new RegExp(escapeRegex(keyword), "i");

        filter = {
          $or: [
            { name: regex },
            { category: regex },
            { cuisine: regex },
          ],
        };
      }
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /api/foods/:id
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findOne(getFoodFilter(req.params.id));

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn",
      });
    }

    return res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// POST /api/foods
router.post("/", async (req, res) => {
  try {
    const food = await Food.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Thêm món ăn thành công",
      data: food,
    });
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// PUT /api/foods/:id
router.put("/:id", async (req, res) => {
  try {
    // Không cho phép thay đổi _id trực tiếp
    if (Object.prototype.hasOwnProperty.call(req.body, "_id")) {
      return res.status(400).json({
        success: false,
        message: "Không được thay đổi _id",
      });
    }

    const food = await Food.findOneAndUpdate(
      getFoodFilter(req.params.id),
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        strict: "throw",
      }
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn cần cập nhật",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật món ăn thành công",
      data: food,
    });
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// DELETE /api/foods/:id
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findOneAndDelete(
      getFoodFilter(req.params.id)
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn cần xóa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa món ăn thành công",
      data: food,
    });
  } catch (error) {
    return handleRouteError(res, error);
  }
});

module.exports = router;