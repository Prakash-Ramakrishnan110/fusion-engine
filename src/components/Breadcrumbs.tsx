import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  const breadcrumbs: BreadcrumbItem[] = [
    ...pathSegments.slice(0, -1).map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: "/" + pathSegments.slice(0, index + 1).join('/')
    }))
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 py-4" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={14} className="mx-2 text-gray-400" />
          )}
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
