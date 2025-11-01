import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SportIconProps {
  name: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

const SportIcon = ({ name, icon: Icon, color, path }: SportIconProps) => {
  return (
    <Link to={path} className="group">
      <div className="flex flex-col items-center space-y-3 p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300 hover:scale-105">
        <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-300 group-hover:text-white">{name}</span>
      </div>
    </Link>
  );
};

export default SportIcon;

