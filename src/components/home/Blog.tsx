import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, X, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ToastFaliure } from "../dashboard/productMain/AllProductsTable";
import { ISampleBlogs } from "../../utils/constants";
import { useNavigate} from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../utils/utility-functions";

const getBlogs = async () => {
    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/get-all-blogs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
        });
    
        const data = await response.json();
        if ( !response.ok ){
          throw new Error("error" + response);
        }
        console.log(data.data);
        return data.data;
      } catch (error: any) {
        console.log(error);
        toast.error("Error while fetching blogs, please refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
        return error;
    }
}

const Blog = ({ blog } : { blog : ISampleBlogs }) => {
    const navigate = useNavigate();

    return (
        <article className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-yellow-200 hover:border-[#fef9c3]">
            {/* Image Container */}
            <div className="relative overflow-hidden h-56">
                <img 
                    src={optimizeCloudinaryUrl(blog?.blogImgUrl?.url)} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Content Container */}
            <div className="p-6">
                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time dateTime="2024-01-01">January 1, 2024</time>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {blog.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    Discover the latest insights and stories from our blog. Learn about new trends, tips, and industry knowledge.
                </p>
                
                {/* Read More Button */}
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="group/button p-0 h-auto text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"
                >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-1" />
                </Button>
            </div>
        </article>
    );
}

export const BlogPage = () => {
    const [ blogs, setBlogs ] = useState<Array<ISampleBlogs>>([]);
    const [ isLoadmoreButtonDisabled, setIsLoadmoreButtonDisabled ] = useState(false);
    const [visibleItemCount, setVisibleItemCount] = useState(6);
    const [displayedData, setDisplayedData] = useState(blogs?.slice(0, visibleItemCount));

    useEffect(() => {
        if ( displayedData.length === blogs.length ) {
            setIsLoadmoreButtonDisabled(true);
        } else {
            setIsLoadmoreButtonDisabled(false);
        }
    }, [displayedData]);

    useEffect(() => {
        (async () => {
            setBlogs(await getBlogs());
        })();
    }, []);

    return (
        <div className="min-h-screen font-[Quicksand]" style={{backgroundColor: '#ffff'}}>
            {/* Hero Section */}
            <div className="relative">
                <div className="relative h-80 overflow-hidden">
                    <img 
                        src="https://res.cloudinary.com/dmrgscauc/image/upload/v1756883051/banner_ha5rfq.png" 
                        className="w-full h-full object-cover opacity-50" 
                        alt="Blog header"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-5xl font-bold mb-4 text-gray-800">
                                Daadi's Blog
                            </h1>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto text-gray-700">
                                Stories, insights, and inspiration from our journey
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Description */}
                <div className="max-w-4xl mx-auto mb-16">
                    <p className="text-gray-600 text-lg leading-relaxed text-center">
                        Welcome to our blog where we share insights, stories, and knowledge. 
                        We believe in the power of sharing experiences and learning from one another. 
                        Join us on this journey as we explore topics that matter to our community.
                    </p>
                </div>

                {/* Blog Grid */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
                        {blogs.map((blog: ISampleBlogs, index: number) => (
                            <Blog key={blog._id || index} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-600 mb-4">
                            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-yellow-200">
                                <Calendar className="w-12 h-12 text-yellow-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
                        <p className="text-gray-600">Check back soon for new content!</p>
                    </div>
                )}

                {/* Load More Section */}
                {blogs.length > 0 && (
                    <div className="text-center">
                        {displayedData?.length === blogs?.length ? (
                            <div className="inline-flex flex-col items-center gap-4">
                                <p className="text-gray-500 italic">That's all for now!</p>
                                <div className="w-16 h-px bg-gray-300"></div>
                            </div>
                        ) : (
                            <Button 
                                disabled={isLoadmoreButtonDisabled} 
                                onClick={() => {
                                    setVisibleItemCount(prevCount => prevCount + 6);
                                    setDisplayedData(blogs?.slice(0, visibleItemCount + 6));
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-8 py-3 text-base font-medium transition-colors border border-yellow-400"
                            >
                                {displayedData.length === blogs.length ? (
                                    <>
                                        All loaded 
                                        <X className="w-5 h-5 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Load More Posts 
                                        <Plus className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};