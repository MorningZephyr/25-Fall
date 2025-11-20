function MenuItem({ item, onAddToCart }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(item.name, item.price)}
        >
          Add to Cart
        </button>
      </td>
    </tr>
  );
}

export default MenuItem;

