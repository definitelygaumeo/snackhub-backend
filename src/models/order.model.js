const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    flavor: String,
    size: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng không thể nhỏ hơn 1']
    }
  }],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  phoneNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Banking', 'Credit Card', 'Momo', 'ZaloPay']
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Tổng giá trị sản phẩm không thể âm']
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: [0, 'Phí vận chuyển không thể âm']
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Tổng giá trị đơn hàng không thể âm']
  },
  couponApplied: {
    code: String,
    discount: Number
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  trackingNumber: String,
  notes: String
}, {
  timestamps: true
});

// Tính toán tổng đơn hàng trước khi lưu
orderSchema.pre('save', function(next) {
  // Đảm bảo subtotal là tổng giá trị các sản phẩm
  this.subtotal = this.items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Tính tổng đơn hàng
  this.totalPrice = this.subtotal + this.shippingPrice - (this.discount || 0);
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;