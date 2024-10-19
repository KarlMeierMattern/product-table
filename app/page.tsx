"use client";

import { useState, useEffect } from "react";

type Product = {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
};

type Props = {
  products: Product[];
};

type SearchProps = {
  filterText: string;
  onFilterTextChange: (text: string) => void;
  inStockOnly: boolean;
  onInstockChange: (inStockOnly: boolean) => void;
};

type ProductTableProps = {
  products: Product[];
  filterText: string;
  inStockOnly: boolean;
};

function FilterableProductTable({ products }: Props) {
  const [filterText, setFilterText] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  // state to manage text search

  return (
    <>
      <SearchBar
        filterText={filterText}
        onFilterTextChange={setFilterText}
        inStockOnly={inStockOnly}
        onInstockChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </>
  );
}

function SearchBar({
  filterText,
  onFilterTextChange,
  inStockOnly,
  onInstockChange,
}: SearchProps) {
  return (
    <form>
      <label>
        <input
          className="text-black"
          type="text"
          placeholder="...search"
          value={filterText}
          onChange={(e) => {
            onFilterTextChange(e.target.value);
          }}
        />
      </label>
      <label>
        <input
          className="text-black"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => {
            onInstockChange(e.target.checked);
          }}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

function ProductTable({
  products,
  filterText,
  inStockOnly,
}: ProductTableProps) {
  const [hydrated, setHydrated] = useState(false);

  // Ensure client and server rendering match by waiting for hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render an empty table initially to avoid mismatches
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    );
  }

  const rows: JSX.Element[] = [];
  let lastCategory = "";

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    } else if (inStockOnly && !product.stocked) {
      return;
    } else if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow product={product} key={product.category} />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });
  return (
    <table>
      <thead>
        <tr>
          <th className="text-black pt-4">Name</th>
          <th className="text-black pt-4">Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function ProductCategoryRow({ product }: { product: Product }) {
  return (
    <tr>
      <th colSpan={2}>{product.category}</th>;
    </tr>
  );
}

function ProductRow({ product }: { product: Product }) {
  const displayName = product.stocked ? "text-black" : "text-red-500";

  return (
    <tr>
      <td className={`${displayName} pr-8`}>{product.name}</td>
      <td className={displayName}>{product.price}</td>
    </tr>
  );
}

const products = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterableProductTable products={products} />;
}
