
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-6">
      <div className="glass-panel p-8 text-center animate-fade-in">
        <h1 className="text-6xl font-light tracking-tight text-gray-900">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          This page doesn't exist
        </p>
        <Link 
          to="/" 
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-primary/90"
        >
          Return to Piano
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
