import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'

import './index.css'

class ProductItemDetails extends Component {
  state = {
    productItem: {},
    similarItems: [],
    quantity: 1,
    isFailure: false,
    isLoading: true,
  }

  componentDidMount() {
    this.getProduct()
  }

  onClickMinus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getProduct = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)

    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        title: data.title,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }

      const similarProds = updatedData.similarProducts.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        title: each.title,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
        style: each.style,
      }))

      this.setState({
        productItem: updatedData,
        similarItems: similarProds,
        isLoading: false,
        isFailure: false,
      })
    } else if (response.status === 404) {
      this.setState({isFailure: true, isLoading: false})
    }
  }

  renderProduct = () => {
    const {productItem, similarItems, quantity} = this.state
    const {price} = productItem

    return (
      <div className="product-item-details">
        <div className="upper-section">
          <img
            className="product-image"
            src={productItem.imageUrl}
            alt="product"
          />
          <div className="details-section">
            <h1>{productItem.title}</h1>
            <p>Rs {productItem.price}</p>
            <div className="ratings-reviews">
              <div className="rating-section">
                <p>{productItem.rating}</p>
                <img
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{productItem.totalReviews} reviews</p>
            </div>
            <p className="product-description">{productItem.description}</p>
            <p className="available-brand">
              Available:{productItem.availability}
            </p>
            <p className="available-brand">Brand:{productItem.brand}</p>
            <hr />
            <div className="quantity-selection">
              <button data-testid="minus" onClick={this.onClickMinus}>
                <BsDashSquare className="icons" />
              </button>

              <p className="quantity">{quantity}</p>
              <button data-testid="plus" onClick={this.onClickPlus}>
                <BsPlusSquare className="icons" />
              </button>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
        <div className="lower-section">
          <h1 className="heading-lower">Similar Products</h1>
          <ul className="similar-products-list">
            {similarItems.map(each => (
              <li className="list-item" key={each.id}>
                <img
                  className="similar-product-image"
                  src={each.imageUrl}
                  alt="similar product"
                />
                <h3 className="similar-product-title">{each.title}</h3>
                <p className="similar-product-brand">by {each.brand}</p>
                <div className="rating-and-price">
                  <p className="similar-product-price">Rs {each.price}/-</p>
                  <div className="rating-section">
                    <p>{each.rating}</p>
                    <img
                      className="star-image"
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="error-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button className="continue-btn">Continue Shopping</button>
      </Link>
    </div>
  )

  render() {
    const {similarItems, isFailure, isLoading} = this.state

    return (
      <>
        <Header />
        {isLoading ? (
          <div className="loader" data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
          </div>
        ) : (
          <>{isFailure ? this.renderFailureView() : this.renderProduct()}</>
        )}
      </>
    )
  }
}

export default ProductItemDetails
