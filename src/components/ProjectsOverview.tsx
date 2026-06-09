import React from 'react';
import { Home, ExternalLink, ShieldCheck, Map, Droplet, Star } from 'lucide-react';

interface ProjectInfo {
  id: string;
  name: string;
  location: string;
  description: string;
  towers: string;
  avgSalePrice: string;
  avgRentPrice: string;
  totalPostings: number;
  saleCount?: number;
  rentCount?: number;
  highlights: string[];
}

interface ProjectsOverviewProps {
  onSelectProject: (projectName: string) => void;
}

export default function ProjectsOverview({ onSelectProject }: ProjectsOverviewProps) {
  const [projects, setProjects] = React.useState<ProjectInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/projects-info')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project statistics:', err);
        setLoading(false);
      });
  }, []);

  const projectImages: Record<string, string> = {
    'ocp1': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'ocp2': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'ocp3': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 text-cyan-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mr-2"></div>
        <span className="font-medium">Đang tải thông tin đô thị Vinhomes...</span>
      </div>
    );
  }

  return (
    <section id="projects-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Hệ Sinh Thái Kỳ Quan Vinhomes Ocean Park
        </h2>
        <p className="mt-2 text-slate-400 font-medium">
          Khám phá 3 siêu đô thị trọng điểm phía Đông thủ đô - Biểu tượng đô thị đỉnh cao sống nghỉ dưỡng đẳng cấp quốc tế.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((proj) => {
          const imgUrl = projectImages[proj.id] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
          return (
            <div
              key={proj.id}
              className="bg-slate-900 border border-cyan-950/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={imgUrl}
                  alt={proj.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold text-xl tracking-tight leading-tight">{proj.name}</span>
                  <div className="flex items-center text-cyan-400 text-xs mt-1 font-semibold">
                    <Map className="w-3.5 h-3.5 mr-1" />
                    <span>{proj.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 bg-cyan-950/20 text-center py-2.5 border-y border-cyan-950/40 text-xs text-slate-400 font-medium">
                <div>
                  <span className="block text-white font-bold text-sm tracking-tight">{proj.totalPostings}</span>
                  <span>Tin đang có</span>
                </div>
                <div className="border-x border-cyan-950/40">
                  <span className="block text-cyan-400 font-bold text-sm tracking-tight">{proj.saleCount || 0} c</span>
                  <span>Đang bán</span>
                </div>
                <div>
                  <span className="block text-amber-500 font-bold text-sm tracking-tight">{proj.rentCount || 0} c</span>
                  <span>Cho thuê</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Highlights Bullet */}
                  <div className="space-y-1.5 mb-5">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Đặc điểm nổi bật</span>
                    {proj.highlights?.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-center text-slate-300 text-xs">
                        <Droplet className="w-3.5 h-3.5 text-cyan-500 mr-2 flex-shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub info values */}
                <div className="pt-4 border-t border-cyan-950/40 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Giá bán TB:</span>
                    <span className="text-white font-semibold">{proj.avgSalePrice}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Giá thuê TB:</span>
                    <span className="text-white font-semibold">{proj.avgRentPrice}</span>
                  </div>

                  <button
                    onClick={() => onSelectProject(proj.name)}
                    className="mt-4 w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-800/40 hover:border-cyan-500 text-cyan-400 py-2 rounded-xl text-xs font-semibold tracking-wider transition duration-200"
                  >
                    <span>XEM TIN ĐĂNG KHU VỰC</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Pledge Trust banner */}
      <div className="mt-14 p-6 bg-slate-900/40 border border-cyan-950/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-tight mb-0.5">Cam Kết OceanPark Homes</h4>
            <p className="text-slate-400 text-xs">Các tin đăng 100% được xác minh chính chủ, hỗ trợ tư vấn pháp lý chuyển nhượng trọn gói, bảo mật tuyệt đối.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://picsum.photos/seed/user-${i}/40/40`}
                alt="Broker Profile"
                className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-cyan-400">
            ⭐ 5.0 (420+ khách hàng hài lòng)
          </span>
        </div>
      </div>
    </section>
  );
}
