import { classNames } from "@/utils/common";

const CategoryCard = ({
  id,
  name,
  currentCategory,
  setCurrentCategory,
  styleCatalog,
}) => {
  return (
    <div
      className={classNames(
        currentCategory === id ? "bg-primary text-white" : "",
        `cursor-pointer rounded-full ${
          styleCatalog ? "ml-1 mr-3 px-2" : "px-4"
        } whitespace-nowrap py-1 text-sm font-medium`
      )}
      onClick={() => setCurrentCategory(id)}
    >
      {name}
    </div>
  );
};

export default CategoryCard;
