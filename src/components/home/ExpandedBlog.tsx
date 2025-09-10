import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ISampleBlogs } from "../../utils/constants";
import { toast } from "sonner";
import { ToastFaliure } from "../dashboard/productMain/AllProductsTable";
import parse from 'html-react-parser';

export const Expandedblog = () => {
    
    const { blogId } = useParams();
    const [ blog, setBlog ] = useState<ISampleBlogs>();

    const getBlog = async () => {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/get-a-blog/${blogId}`, {
                method: "GET",
                headers: {
                    "contentType": "application/json",
                },
                credentials: "include"
            });

            const data = await response.json();

            console.log(data);

            if ( !response.ok ) throw new Error("Filed while fetching blog");
            
            console.log(data.data);
            return data.data;

        } catch (error: any) {
            console.log(error);
            toast.error("Error while fetching the blog, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
            return error;
        }
    };

    useEffect(() => {
        (async () => {
            setBlog(await getBlog());            
        })();
    }, []);
    
    return blog ? (
        <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 flex-col">
            <div id="heading" className="flex w-full h-[300px] inset-0 bg-gradient-to-t from-white from-5% relative justify-center items-center">
                <img src={blog?.blogImgUrl?.url} className="absolute backdrop-blur-lg rounded-t-lg w-full h-full top-0 left-0 object-cover z-[-1]" />
                <h2 className="font-[quicksand] font-bold text-5xl text-center mix-blend-difference invert">{blog?.title}</h2>
            </div>
            <div className="rounded-lg">
                {parse(blog?.blogContent.markup!)}
            </div>
        </div>
    ) : (
        <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 justify-center items-center flex-col">
            <img src="/public/loader.svg" />
        </div>
    );
}