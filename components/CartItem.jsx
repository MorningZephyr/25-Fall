function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">
          ${item.price.toFixed(2)} x {item.quantity}
        </div>
      </div>
      <button 
        className="remove-item-btn"
        onClick={() => onRemove(item.name)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;

