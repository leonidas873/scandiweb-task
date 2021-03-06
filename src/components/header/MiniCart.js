import React from "react";
import "./header.css";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import { connect } from "react-redux";
import {
  increaseProductQuantity,
  decreaseProductQuantity,
  deleteProductFromCart,
  toggleShowCart,
  toggleMiniCart,
} from "../../redux/actions/actions";
import getSymbolFromCurrency from "currency-symbol-map";

class MiniCart extends React.Component {
  onDecreaseProductQuantity = (product) => {
    if (product.quantity > 1) {
      this.props.decreaseProductQuantity(
        this.props.cartProducts,
        product,
        product.selectedAttributes
      );
    } else if (product.quantity === 1) {
      this.props.deleteProductFromCart(
        this.props.cartProducts,
        product,
        product.selectedAttributes
      );
    }
  };

  getPrice = (prices) => {
    let amount = prices.filter(
      (price) => price.currency === this.props.currency
    )[0].amount;
    return amount;
  };

  calcTotalQuantity = () => {
    let quantity = 0;
this.props.cartProducts.forEach(product=>{quantity = quantity+product.quantity; return product})
return quantity;
  }


  calcTotalCost = () => {
    let total = 0;

    for (let i = 0; i < this.props.cartProducts.length; i++) {
      total +=
        this.props.cartProducts[i].prices.filter(
          (item) => item.currency === this.props.currency
        )[0].amount * this.props.cartProducts[i].quantity;
    }
    return total;
  };

  render() {
    return (
      <div className="miniCart__container">
        <div className="miniCart__header">
          <h4>My Bag,</h4>
          <span>{this.calcTotalQuantity()} items</span>
        </div>

        {this.props.cartProducts.length === 0 ? (
          <img
            className="empty-cart"
            src="https://www.99fashionbrands.com/wp-content/uploads/2020/12/empty_cart-1200x900.png"
            alt=""
          />
        ) : (
          <div className="miniCart__products">
            {this.props.cartProducts.map((product) => (
              <div
                className="miniCart__product"
                key={this.props.cartProducts.indexOf(product)}
              >
                <div className="product-col-ver">
                  <div className="product__brand">{product.brand}</div>
                  <h5 className="product__title">{product.name}</h5>
                  <p className="product__price">
                    {getSymbolFromCurrency(this.props.currency)}{" "}
                    {this.getPrice(product.prices)}
                  </p>
                  <div className="miniCart__attributes">
                    {product.attributes.map((attr) => (
                      <div className="miniCart__attribute" key={attr.id}>
                        <h5 className="attribute__name">{attr.name}:</h5>
                        <ul className="miniCart__attribute-options">
                          {attr.items.map((item) => (
                            <li
                              className={
                                "miniCart__attribute-oprion " +
                                (product.selectedAttributes.filter(
                                  (elem) =>
                                    elem.name === attr.name &&
                                    elem.value === item.value
                                ).length > 0
                                ? attr.type === "swatch"
                                ? "swatch-attribute--selected"
                                : "miniCart__attribute-oprion--selected"
                              : "")

                                  
                              }
                              key={item.id}
                              style={{
                                background:
                                  attr.type === "swatch"
                                    ? item.value
                                    : "transparant",
                              }}
                            >
                              {attr.type === "swatch" ? "" : item.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="product-col-hor">
                  <div className="product__qty">
                    <AiOutlinePlusSquare
                      onClick={() =>
                        this.props.increaseProductQuantity(
                          this.props.cartProducts,
                          product,
                          product.selectedAttributes
                        )
                      }
                    />
                    <span>{product.quantity}</span>
                    <AiOutlineMinusSquare
                      onClick={() => this.onDecreaseProductQuantity(product)}
                    />
                  </div>
                  <img
                    className="product__image"
                    src={product.gallery[0]}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="product__total-cost">
          <span>Total</span>
          <span>
            {getSymbolFromCurrency(this.props.currency)} {this.calcTotalCost()}
          </span>
        </div>
        <div className="miniCart__btns">
          <button
            className="view-bag"
            onClick={() => {
              this.props.toggleMiniCart(false);
              this.props.toggleShowCart(true);
            }}
          >
            VIEW BAG
          </button>
          <button
            className="check-out"
            onClick={() => this.props.toggleMiniCart(false)}
          >
            CHECK OUT
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartProducts: state.cart.cartProducts,
    currency: state.allProducts.currency,
  };
};

const mapDispatchToProps = () => {
  return {
    increaseProductQuantity,
    decreaseProductQuantity,
    deleteProductFromCart,
    toggleShowCart,
    toggleMiniCart,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(MiniCart);
