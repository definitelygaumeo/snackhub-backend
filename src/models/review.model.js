const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Vui lòng thêm đánh giá từ 1-5 sao'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề đánh giá'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Vui lòng để lại nhận xét của bạn'],
    trim: true
  },
  images: [{
    url: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Đảm bảo một người dùng chỉ có thể đánh giá một sản phẩm một lần
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Sau khi tạo/sửa đánh giá, cập nhật đánh giá trung bình của sản phẩm
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    { 
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: parseFloat(stats[0].avgRating.toFixed(1)),
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;