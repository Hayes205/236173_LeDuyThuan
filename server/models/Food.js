const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      required: [true, "Mã món ăn không được để trống"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Tên món ăn không được để trống"],
      trim: true,
      maxlength: [100, "Tên món ăn không được vượt quá 100 ký tự"],
    },

    category: {
      type: String,
      required: [true, "Loại món ăn không được để trống"],
      trim: true,
    },

    cuisine: {
      type: String,
      required: [true, "Vùng miền hoặc loại ẩm thực không được để trống"],
      trim: true,
    },

    ingredients: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      validate: {
        validator: (value) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.length > 0),
        message: "Nguyên liệu phải là mảng chứa ít nhất một phần tử hợp lệ",
      },
    },

    price: {
      type: Number,
      required: [true, "Giá bán không được để trống"],
      min: [0, "Giá bán không được âm"],
      validate: {
        validator: Number.isFinite,
        message: "Giá bán phải là số hữu hạn",
      },
    },

    quantity: {
      type: Number,
      required: [true, "Số lượng không được để trống"],
      min: [0, "Số lượng không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Số lượng phải là số nguyên",
      },
    },

    description: {
      type: String,
      required: [true, "Mô tả không được để trống"],
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (value) =>
          value === "" || /^https?:\/\/\S+$/i.test(value),
        message: "imageUrl phải là URL HTTP/HTTPS hợp lệ hoặc chuỗi rỗng",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);