import { Link } from "react-router-dom";

type NavlinkProps = {
  path: string;
  pageName: string;
};

export default function Navlink({ path, pageName }: NavlinkProps) {
  return (
    <>
      <li className="z-10">
        <Link
          to={`${path}`}
          className="sm:text-black lg:text-white uppercase font-bold"
        >
          {pageName}
        </Link>
      </li>
    </>
  );
}
