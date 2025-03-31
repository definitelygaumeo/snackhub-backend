const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm không được để trống'],
    trim: true
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Mô tả sản phẩm không được để trống']
  },
  price: {
    type: Number,
    required: [true, 'Giá sản phẩm không được để trống'],
    min: [0, 'Giá sản phẩm không thể âm']
  },
  salePrice: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Danh mục không được để trống']
  },
  country: {
    type: String,
    required: [true, 'Quốc gia xuất xứ không được để trống']
  },
  countryFlag: String,
  nutritionFacts: {
    servingSize: String,
    calories: Number,
    fat: Number,
    carbs: Number,
    protein: Number,
    sugar: Number
  },
  stock: {
    type: Number,
    required: [true, 'Số lượng trong kho không được để trống'],
    min: [0, 'Số lượng trong kho không thể âm'],
    default: 0
  },
  flavors: [String],
  sizes: [{
    name: String,
    priceModifier: {
      type: Number,
      default: 0
    }
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  ingredients: [String],
  allergens: [String],
  expiryDate: Date,
  storageInstructions: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tạo slug tự động từ tên sản phẩm
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual populate để lấy đánh giá
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Tính toán giá khuyến mãi
productSchema.virtual('discountPercentage').get(function() {
  if (this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;