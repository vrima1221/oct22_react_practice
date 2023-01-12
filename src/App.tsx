import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { Product } from './types/Product';
import { User } from './types/User';
import { Category } from './types/Category';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

export const App: React.FC = () => {
  const defaultSelectedUserId = 0;
  const defaultQueryValue = '';

  const [query, setQuery] = useState(defaultQueryValue);
  const [selectedUserId, setSelectedUserId] = useState(defaultSelectedUserId);
  const [products, setProducts] = useState(productsFromServer);

  const getProductCategory = (product: Product): Category | null => {
    return categoriesFromServer
      .find(categorie => categorie.id === product.categoryId) || null;
  };

  const getCategoryOwner = (product: Product): User | null => {
    const recentCategory = getProductCategory(product);

    return usersFromServer.find(user => user.id === recentCategory?.ownerId)
      || null;
  };

  const visibleProducts = products.filter(product => {
    const normalizedProductName = product.name.toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();

    return normalizedProductName.includes(normalizedQuery);
  });

  const handleClearSearch = () => {
    setQuery(defaultQueryValue);
  };

  const handleSelectUser = (user: User) => {
    if (selectedUserId === user.id) {
      return;
    }

    setSelectedUserId(user.id);
    setProducts(productsFromServer.filter(product => {
      return getProductCategory(product)?.ownerId === user.id;
    }));
  };

  const handleAllclick = () => {
    setSelectedUserId(defaultSelectedUserId);
    setProducts(productsFromServer);
  };

  const handleResetClick = () => {
    setSelectedUserId(defaultSelectedUserId);
    setProducts(productsFromServer);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={handleAllclick}
                className={classNames(
                  {
                    'is-active': selectedUserId === 0,
                  },
                )}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  className={classNames(
                    {
                      'is-active': selectedUserId === user.id,
                    },
                  )}
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={handleClearSearch}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetClick}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">

          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(product => (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>

                      <td data-cy="ProductCategory">
                        {`${getProductCategory(product)?.icon} - ${getProductCategory(product)?.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          getCategoryOwner(product)?.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger',
                        )}
                      >
                        {getCategoryOwner(product)?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
