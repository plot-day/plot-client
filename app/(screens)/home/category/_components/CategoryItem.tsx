import IconHolder from "@/components/icon/IconHolder";
import { CategoryType } from "@/store/category";
import { cn } from "@/util/cn";

const CategoryItem = ({ title, icon, group, onClick, className }: Partial<CategoryType & React.HTMLAttributes<HTMLLIElement>>) => {
    return (
      <li
        key={title}
        className={cn("w-full flex items-center justify-between cursor-pointer", className)}
        onClick={onClick}
      >
        <div className="flex flex-col items-center w-full gap-1">
          <IconHolder isCircle={true}>{icon}</IconHolder>
          <div className="text-center w-full">
            {/* <p className="text-xs font-semibold">{group?.title}</p> */}
            <p className="text-xs font-bold leading-tight">{title}</p>
          </div>
        </div>
      </li>
    );
  };

  export default CategoryItem;