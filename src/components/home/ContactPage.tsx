import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
 
const contactFormSchema = z.object({
  name: z.string().min(0, { message: "Cannot be less than 0 characters long!" }).max(30, {message: "Cannot be more than 30 characters long!"}),
  email: z.string().email("Please enter a valid email address"),
  phoneNo: z.coerce.number({invalid_type_error: "Enter a valid number"}).min(10),
  subject: z.string().min(1).max(200),
  message: z.string()
});

export const ContactPage = () => {

    const form = useForm<z.infer<typeof contactFormSchema>>({
          resolver: zodResolver(contactFormSchema),
        //   defaultValues: {
            // username: "",
        // },
    });

    const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
        console.log(values)
    };

    return (
        <div className="w-full flex flex-col min-h-[calc(100vh-56px)]  mt-14">
            <section id="map" className="h-[30%]">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.1234567890123!2d77.5911101!3d12.9152953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15965ccbaed5%3A0x245fa4c9d95df125!2sMegharaj%20Marketing%20Private%20Limited!5e0!3m2!1sen!2sin!4v1693654321000" className="w-full h-full" loading="lazy"></iframe>
            </section>
            <section id="contact" className="flex-1 font-[quicksand] gap-5 p-6 h-auto flex flex-col sm:flex-row sm:flex">
                <div id="more-details" className="grid-cols-5 gap-4 p-4 rounded-lg grid sm:flex-[0.25] bg-gray-100/50 shadow-md">
                    {/*<MapPin className="col-span-1" />
                    <div className="col-span-4 flex flex-col gap-2">
                        <h1 className="text-sm font-bold">Manufactured by:</h1>
                        <p className="text-xs">Meghraj Food Processing India Pvt.Ltd (MFPIPL), Shed No.:03, Plot No.:322-A, Sy. No. 189, Bommasandra-Jigani Hobli, Industrial Area, Jigani Village, Jigani Hobli, Anekal Taluk, Bengaluru Urban, Karnataka - 562105 (India)</p>
                    </div>*/}
                    <Mail className="col-span-1" />
                    <div className="col-span-4">
                        <a href="mailto:contact@meghrajgroup.com">contact@meghrajgroup.com</a>
                    </div>
                    <Phone className="col-span-1"/>
                    <div className="col-span-4">
                        <a href="tel:+919886402902">+919886402902</a>
                    </div>
                    <Store className="col-span-1" />
                    <div className="col-span-4 flex flex-col gap-2">
                        <h1 className="text-sm font-bold">Manufactured by:</h1>
                        <p className="text-xs">Meghraj Marketing Pvt Ltd, No.2006/A, 1st floor, South End E Main Road, 9th Block Jayanagar,<br />Bengaluru - 562106</p>
                    </div>
                </div>
                <div id="contact-form" className="flex-[0.75] p-6 px-10 bg-gray-100/50 flex flex-col gap-4 rounded-lg shadow-md">
                    <h1 className="font-[quicksand]">Looking forward to hearing from you</h1>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label className="col-span-1">Name<span className="text-red-500">*</span></Label>
                                    <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                        {/* <FormLabel className="col-span-1">Name</FormLabel> */}
                                        <FormControl className="col-span-3">
                                            <Input placeholder="Enter your name" className="col-span-3" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Email<span className="text-red-500">*</span></Label>
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                        {/* <FormLabel className="col-span-1">Name</FormLabel> */}
                                        <FormControl className="col-span-3">
                                            <Input placeholder="Enter your email" type="email" className="col-span-3" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Phone number<span className="text-red-500">*</span></Label>
                                    <FormField
                                    control={form.control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                        {/* <FormLabel className="col-span-1">Name</FormLabel> */}
                                        <FormControl className="col-span-3">
                                            <Input type="number" placeholder="Enter your phone number" className="col-span-3" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Subject<span className="text-red-500">*</span></Label>
                                    <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                        {/* <FormLabel className="col-span-1">Name</FormLabel> */}
                                        <FormControl className="col-span-3">
                                            <Input placeholder="Enter a subject" className="col-span-3" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <Label className="col-span-1">Message<span className="text-red-500">*</span></Label>
                                    <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                        {/* <FormLabel className="col-span-1">Name</FormLabel> */}
                                        <FormControl className="col-span-3">
                                            <Textarea placeholder="Enter your message" className="col-span-3 resize-none" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <Button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    );
};