import React, { Component } from "react";
import PropTypes from "prop-types";
//images
import {
  Search,
  DarkMode,
  LightMode,
  Notification,
  ShortCut,
  Close,
  Logout,
} from "../../media/icon/SVGicons";

import user from "../../media/icon/user-profile.png";
import bank from "../../media/icon/company-black.png";
import compare from "../../media/icon/compare.png";
import business from "../../media/icon/business.png";
import prereport from "../../media/icon/transactionReport.png";
import report from "../../media/icon/transactionReport.png";
import transaction from "../../media/icon/doc-type.png";
import category from "../../media/icon/category.png";
import common from "../../media/icon/eye.png";
import tempr from "../../media/icon/eye.png";
import doc from "../../media/icon/eye.png";
import dox from "../../media/icon/document.png";
import settings from "../../media/icon/setting.png";
import subcategory from "../../media/icon/subCategory.png";
import commandline from "../../media/icon/commandline.png";
import home from "../../media/icon/Dashboard.png";
import settlement from "../../media/icon/Settlements.png";
import apidoc from "../../media/icon/ApiDocument.png";
import gateway from "../../media/icon/bank-card-dark.png";
import managemerchant from "../../media/icon/merchManage.png";
import managesetting from "../../media/icon/user-setting.png";
import puser from "../../media/icon/user.png";
import dollar from "../../media/icon/doller-dark.png";

import CustomSelect from "./Custom-select";
import Shortcut from "./Add_Shortcut";
import CustomTooltip from "./Custom-tooltip";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.getCookie("name"),
      email: this.getCookie("email"),
      userRole: this.getCookie("role"),
      companyName: this.getCookie("company_name"),
      token: this.getCookie("token"),
      theme: "light",
      scrolled: false,
      searchOpen: false,
      searchText: "",
      showUserProfileModal: false,

      highlightedOptions: [],
      options: [
        { name: "Dashboard", path: "/dashboard", icon: home },
        { name: "Settlements", icon: settlement, path: "/settlements" },
        { name: "API documentation", icon: apidoc, path: "/apidoc" },
        { name: "Payment Gateway", icon: gateway, path: "/paymentgateway" },
        { name: "Manage Merchant", icon: managemerchant },
        {
          name: "Master Settings",
          icon: managesetting,
          options: [
            { name: "Business Type", icon: business, path: "/businesstype" },
            { name: "Categories", icon: category, path: "/categories" },
            {
              name: "Business Subcategories",
              icon: subcategory,
              path: "/businesssubcategories",
            },
            {
              name: "Manage Currencies",
              icon: settings,
              path: "/managecurrencies",
            },
            { name: "Document Type", icon: doc, path: "/documenttype" },
            {
              name: "Document Categories",
              icon: dox,
              path: "/documentcategories",
            },
            { name: "Bank", icon: bank, path: "/bank" },
          ],
        },
        {
          name: "Report Group",
          icon: report,
          options: [
            {
              name: "Transaction Report",
              icon: transaction,
              path: "/transactionreport",
            },
            { name: "Temp Report", icon: tempr, path: "/tempreport" },
            {
              name: "Temp Unique Order Report",
              icon: report,
              path: "/tempureport",
            },
            {
              name: "Temp Common Order Report",
              icon: common,
              path: "/tempcreport",
            },
            { name: "Payout Report", icon: prereport, path: "/payoutreport" },
            { name: "Compare", icon: compare, path: "/compare" },
          ],
        },
      ],
      currency: [],
      merchant: "",
      companyList: [],
      selectedMerchant: "Select Merchant",
      selectedCurrency: "",
      currentPage: "dashboard",
      showNotification: false,
      notifications: [],
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  componentDidMount = async () => {
    const savedScrollPosition = localStorage.getItem("Header_ScrollY");
    const notifications =
      JSON.parse(sessionStorage.getItem("notifications")) || [];
    this.setState({ notifications });

    const userRole = this.getCookie("role");

    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("keydown", this.handleKeyDown);

    const currentPage = window.location.pathname.split("/")[1];
    this.setState({ currentPage });

    console.log("role user", userRole);
    let currency = [];
    if (userRole === "admin") {
      this.fetchCompanyList();
      currency = ["USD", "EUR", "All Currencies"];
    }
    if (userRole === "merchant") {
      currency = await this.fetchCurrencyList();
      console.log("currency merchant", currency);
    }
    const selectedCurrency = currency[0];
    console.log("selected currency", selectedCurrency);
    this.setState({ currency, selectedCurrency });
    this.handleCurrencyChange(selectedCurrency);
    document.addEventListener("mousedown", this.handleClickOutside);

    this.setState({ notifications });
  };

  componentWillUnmount() {
    localStorage.setItem("Header_ScrollY", window.scrollY);
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const modalElements = [
      document.querySelector(".search-window"),
      document.querySelector(".user-modal"),
    ];

    const isClickInsideModal = modalElements.some(
      (modal) => modal && modal.contains(event.target)
    );

    if (!isClickInsideModal) {
      this.setState({
        searchOpen: false,
        showUserProfileModal: false,
      });
    }
  };

  handleMerchantChange = (merchant) => {
    if (merchant === "Select Merchant") {
      this.setState({
        selectedMerchant: merchant,
        selectedCurrency: this.state.selectedCurrency,
      });
      this.props.onMerchantChange?.("");
    } else {
      this.setState({ selectedMerchant: merchant });
      this.props.onMerchantChange?.(merchant);
    }
  };

  handleCurrencyChange = (currency) => {
    this.setState({ selectedCurrency: currency });
    console.log(currency, "Hello");
    this.props.onCurrencyChange?.(currency);
  };

  handleScroll = () => {
    if (window.scrollY > 0) {
      this.setState({
        scrolled: true,
        showUserProfileModal: false,
        shortcutModal: false,
      });
    } else {
      this.setState({
        scrolled: false,
      });
    }
  };

  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === "light" ? "dark" : "light",
    }));
  };

  toggleSearch = () => {
    this.setState((prevState) => ({
      searchOpen: !prevState.searchOpen,
      showUserProfileModal: false,
      shortcutModal: false,
      showInnerModal: false,
    }));
  };

  toggleUserProfileModal = () => {
    this.setState((prevState) => ({
      showUserProfileModal: !prevState.showUserProfileModal,
      searchOpen: false,
      shortcutModal: false,
      showInnerModal: false,
    }));
  };

  handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const { options } = this.state;

    const flattenedOptions = options.flatMap((option) =>
      option.options ? option.options : [option]
    );

    const filteredOptions = flattenedOptions.filter((option) =>
      option.name.toLowerCase().includes(searchText)
    );

    this.setState((prevState) => ({
      searchText,
      highlightedOptions: searchText
        ? filteredOptions
        : prevState.previousHighlightedOptions,
      previousOptions: prevState.options,
      previousHighlightedOptions: prevState.highlightedOptions,
    }));
  };

  handleKeyDown = (event) => {
    if (event.key === "Escape") {
      this.setState({ searchOpen: false });
    } else if (event.ctrlKey && event.key === "k") {
      this.toggleSearch();
      event.preventDefault();
    }
  };

  selectOption = (option) => {
    if (option.path) {
      window.location.href = option.path;
    }
  };

  toggleUserShortcutModal = () => {
    this.setState((prevState) => ({
      shortcutModal: !prevState.shortcutModal,
      searchOpen: false,
      showUserProfileModal: false,
      showInnerModal: false,
    }));
  };

  fetchCurrencyList = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, companyName } = this.state;
    try {
      const response = await fetch(
        `${backendURL}/currenciesforcompany?company_name=${companyName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("currency data", data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      this.setState({
        errorMessage: "Error fetching data. Please try again later.",
      });
    }
  };

  fetchCompanyList = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    try {
      const response = await fetch(`${backendURL}/companylist?status=Active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ companyList: data, errorMessage: "" });
    } catch (error) {
      console.error("Fetch error:", error);
      this.setState({
        errorMessage: "Error fetching data. Please try again later.",
        companyList: [],
      });
    }
  };

  handleLogout = () => {
    this.deleteCookie("name");
    this.deleteCookie("email");
    this.deleteCookie("role");
    this.deleteCookie("company_name");
    this.deleteCookie("token");

    window.location.href = "/";
  };

  deleteCookie = (name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  handleButtonClick = () => {
    this.props.onStartFetchingData();
  };

  handleNotificationClick = () => {
    this.setState((prevState) => ({
      showNotificationModal: !prevState.showNotificationModal,
    }));
  };

  render() {
    const {
      theme,
      scrolled,
      highlightedOptions,
      searchOpen,
      shortcutModal,
      options,
      currency,
      selectedCurrency,
      selectedMerchant,
      showUserProfileModal,
      currentPage,
      userRole,
      showNotificationModal,
      notifications,
    } = this.state;

    const hasNotifications = notifications.length > 0;

    return (
      <>
        {shortcutModal && (
          <Shortcut
            options={options}
            addShortcut={this.addShortcut}
            onClose={() => this.setState({ shortcutModal: false })}
          />
        )}

        <div id="header" className={scrolled ? "scrolled" : ""}>
          <nav>
            <div className="header-left">
              <div className="Search-div" onClick={this.toggleSearch}>
                <CustomTooltip title="Search Bar" leftMargin={25}>
                  <Search className="icon"></Search>
                </CustomTooltip>
                <CustomTooltip title="Press Ctrl+k">
                  <p className="header-search-text">
                    Search &nbsp;
                    <img
                      src={commandline}
                      className="icon"
                      alt="commandline icon"
                    />
                    <strong>K</strong>
                  </p>
                </CustomTooltip>
              </div>
            </div>

            <div className="header-right">
              {currentPage === "dashboard" && (
                <div className="custom-select-div">
                  <CustomSelect
                    options={currency}
                    selectedValue={selectedCurrency}
                    onChange={this.handleCurrencyChange}
                  />
                  {userRole === "admin" && (
                    <CustomSelect
                      defaultLabel="Select Merchant"
                      options={[...this.state.companyList]}
                      selectedValue={selectedMerchant}
                      onChange={this.handleMerchantChange}
                    />
                  )}
                </div>
              )}
              {theme === "light" ? (
                <CustomTooltip title="Light Mode">
                  <LightMode
                    className="icon"
                    onClick={this.toggleTheme}
                  ></LightMode>
                </CustomTooltip>
              ) : (
                <CustomTooltip title="Dark Mode">
                  <DarkMode
                    className="icon"
                    onClick={this.toggleTheme}
                  ></DarkMode>
                </CustomTooltip>
              )}
              <CustomTooltip title="Add shortcut">
                <ShortCut
                  className="icon"
                  onClick={this.toggleUserShortcutModal}
                ></ShortCut>
              </CustomTooltip>
              <CustomTooltip title="Notification">
                <div
                  className="notification-icon-wrapper"
                  onClick={this.handleNotificationClick}
                >
                  <Notification className="icon" />
                  {hasNotifications && (
                    <div className="notification-badge"></div>
                  )}
                </div>
              </CustomTooltip>
              <div className="user-profile-div">
                <CustomTooltip title="Your Profile" leftMargin={-25}>
                  <img
                    className="icon user-profile"
                    src={user}
                    alt="user-profile"
                    onClick={this.toggleUserProfileModal}
                  ></img>
                </CustomTooltip>
                <div className="user-profile-badge">
                  <div></div>
                </div>
              </div>
            </div>
          </nav>

          {showUserProfileModal && (
            <div className="search-window user-modal">
              <header className="modal-container-header">
                <img
                  className="icon user-profile"
                  src={user}
                  alt="user-profile"
                ></img>
                <div className="user-details">
                  <h5>{this.state.userName}</h5>
                  <p className="p2">{this.state.email}</p>
                </div>
                <span
                  className="close"
                  onClick={() => this.setState({ showUserProfileModal: false })}
                >
                  &times;
                </span>
              </header>

              <div className="user-setting-options">
                <div className="esc-div user">
                  <img
                    className="icon icon2"
                    src={puser}
                    alt="user-profile"
                  ></img>
                  <h5>My Profile</h5>
                </div>

                <div className="esc-div user">
                  <img
                    className="icon icon2"
                    src={dollar}
                    alt="user-profile"
                  ></img>
                  <h5>Pricing</h5>
                </div>

                <button
                  className="btn-primary userbtn"
                  onClick={this.handleLogout}
                >
                  Logout <Logout className="white-icon" />
                </button>
              </div>
            </div>
          )}
        </div>

        {showNotificationModal && (
          <div className="notification-modal">
            <header className="modal-container-header">
              <h5>Notifications</h5>
              <span className="close" onClick={this.handleNotificationClick}>
                &times;
              </span>
            </header>
            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`notification ${notification.type}`}
                  >
                    {notification.message}
                  </div>
                ))
              ) : (
                <div>No notifications available</div>
              )}
              <button
              className="btn-primary view-btn"
              onClick={() =>
                (window.location.href = "/allmerchant?showPending=true")
              }
            >
              View 
            </button>
            </div>
            
          </div>
        )}

        {searchOpen && (
          <div className="search-window-overlay">
            <div className="search-window search-modal">
              <header className="modal-container-header">
                <div className="search-input-container">
                  <Search className="icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={this.handleSearch}
                    className="input-search"
                  />
                </div>
                <div className="esc-div">
                  <p className="p2">[esc]</p>
                  <Close className="icon" onClick={this.toggleSearch} />
                </div>
              </header>
              <div className="option-container">
                {options.slice(0, 5).map((option) => (
                  <p
                    className={`p2 pname ${
                      highlightedOptions.includes(option) ? "highlight" : ""
                    }`}
                    onClick={() => this.selectOption(option)}
                  >
                    {option.name}
                  </p>
                ))}
              </div>

              <div className="flex-options-container">
                {options.slice(5).map((optionGroup) => (
                  <div className="options-header">
                    <p className="p2 pname">{optionGroup.name}</p>
                    <div className="suboptions-container">
                      {optionGroup.options &&
                        optionGroup.options.map((option) => (
                          <div
                            className={`option ${
                              highlightedOptions.includes(option)
                                ? "highlight"
                                : ""
                            }`}
                            key={option.name}
                            onClick={() => this.selectOption(option)}
                          >
                            <div className="suboptions">
                              <img
                                src={option.icon}
                                className="icon"
                                alt="options icon"
                              />
                              {option.name}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

Header.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ),
};

Header.defaultProps = {
  notifications: [],
};

export default Header;
