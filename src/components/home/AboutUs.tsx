{/*import React from 'react';
import { Timeline } from './AboutUsTimelineAnimation';

// Timeline data for DAADI'S journey
const timelineData = [
  {
    title: "1921",
    content: (
      <div style={{fontFamily: 'Poppins, sans-serif'}}>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The Foundation</h4>
        <p className="mb-6 text-sm font-normal text-gray-700 dark:text-neutral-200 leading-relaxed">
          DAADI'S was founded with a vision to serve authentic traditional cuisine 
          that brings families together. Started as a small family kitchen with 
          recipes passed down through generations, our grandmother's love for cooking 
          became the cornerstone of what would grow into a beloved culinary destination.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 lg:h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🏠</span>
              <p className="text-xs font-medium text-amber-800">Family Kitchen</p>
            </div>
          </div>
          <div className="h-32 lg:h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">👵</span>
              <p className="text-xs font-medium text-orange-800">Traditional Recipes</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2000",
    content: (
      <div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">New Millennium Growth</h4>
        <p className="mb-6 text-sm font-normal text-gray-700 dark:text-neutral-200 leading-relaxed">
          Entering the new millennium, DAADI'S expanded its reach while maintaining 
          the authentic taste and quality that made us special. We opened our first 
          brick-and-mortar restaurant, bringing our family recipes to a wider community 
          and establishing the foundation for future growth.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 lg:h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🏪</span>
              <p className="text-xs font-medium text-green-800">First Restaurant</p>
            </div>
          </div>
          <div className="h-32 lg:h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">📈</span>
              <p className="text-xs font-medium text-blue-800">Community Growth</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2003",
    content: (
      <div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Recipe Innovation</h4>
        <p className="mb-6 text-sm font-normal text-gray-700 dark:text-neutral-200 leading-relaxed">
          We began documenting and perfecting our traditional recipes, ensuring 
          consistency across all our offerings while introducing new dishes that 
          complemented our core menu. This period marked our commitment to both 
          preserving tradition and embracing culinary innovation.
        </p>
        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-green-600">✅</span>
            <span>Standardized 50+ traditional recipes</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-green-600">✅</span>
            <span>Introduced fusion dishes</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-green-600">✅</span>
            <span>Quality control systems established</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-green-600">✅</span>
            <span>Recipe documentation completed</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2009",
    content: (
      <div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Digital Transformation</h4>
        <p className="mb-6 text-sm font-normal text-gray-700 dark:text-neutral-200 leading-relaxed">
          DAADI'S embraced the digital age by launching our first website and 
          online ordering system, making our delicious food accessible to more 
          customers than ever before. This technological leap allowed us to maintain 
          personal connections while expanding our reach significantly.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 lg:h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">💻</span>
              <p className="text-xs font-medium text-purple-800">Online Platform</p>
            </div>
          </div>
          <div className="h-32 lg:h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🌐</span>
              <p className="text-xs font-medium text-indigo-800">Digital Ordering</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2019",
    content: (
      <div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Modern Excellence</h4>
        <p className="mb-6 text-sm font-normal text-gray-700 dark:text-neutral-200 leading-relaxed">
          Today, DAADI'S continues to honor our heritage while embracing modern 
          culinary techniques and sustainable practices. We've become a beloved 
          brand known for authentic flavors, exceptional service, and our unwavering 
          commitment to bringing families together through food.
        </p>
        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <span className="text-amber-600">✅</span>
            <span>15+ locations nationwide</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <span className="text-amber-600">✅</span>
            <span>Award-winning cuisine recognition</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <span className="text-amber-600">✅</span>
            <span>Sustainable sourcing practices</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <span className="text-amber-600">✅</span>
            <span>Community partnerships established</span>
          </div>
        </div>
      </div>
    ),
  },
];

export const AboutUs = () => {
  return (
    <div className="relative w-full min-h-screen">
      {/* Background decoration 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Timeline Component 
      <div className="relative w-full overflow-clip">
        <Timeline data={timelineData} />
      </div>
    </div>
  );
};*/}

import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-[Quicksand]">
      {/* Header/Navigation - Simple version */}
      <nav className="bg-yellow-400 py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="text-black text-xl font-bold">Daadi's</div>
          <div className="ml-8">
            <span className="text-black font-medium">Our Story</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-black mb-8 border-b-4 border-yellow-400 pb-4">
          Our Story
        </h1>

        {/* Main Content */}
        <div className="space-y-6 text-black leading-relaxed">
          <p className="text-lg">
            Daadi's is a leading ethnic food brand which provides traditional foods in convenient packaged form. Started in 2008, Daadi's is part of the 30 year old Meghraj Group. Daadi's khakhras are healthy and are hygienically manufactured in a state of art facility in Bengaluru.
          </p>

          <p className="text-lg">
            Daadi's currently manufacturers Traditional Range of Khakhra (Golden Wheat Crisps), Wellness Range Khakhra (Cereal Khakhra), Mobile Range Khakhra (Pocket sized Khakhra), Bhakhri (reminiscent of the Mathri (North India) and the Nippattu or Thatte (South India). Miniatures Range of khakhra (On the go snack), Besan Laddoo (A preparation of pure cow ghee, besan & cardamom), Chutney Powder (Fresh Chutney Powders) & Premium Delight (Gift box - assortment of Daadi's products for all festivals and events). All our products are made using age-old traditional recipes and presented to today's world in a very modern and convenient form.
          </p>

          {/* Highlighted Quote 1 */}
          <blockquote className="bg-yellow-100 border-l-4 border-yellow-400 p-6 my-8">
            <p className="text-lg font-semibold text-black italic">
              All our products are free from preservatives and artificial colours and flavours.
            </p>
          </blockquote>

          <p className="text-lg">
            In today's world where time is sparse you can meet your immediate culinary desires with Daadi's.
          </p>

          <p className="text-lg">
            Having a strong presence in South India, Daadi's is aggressively planning to spread to other states and also quickly planning to explore new flavors by introducing new products. Daadi's is available in all leading supermarkets and is banking on its wide network to increase its market.
          </p>

          {/* Highlighted Quote 2 */}
          <blockquote className="bg-yellow-100 border-l-4 border-yellow-400 p-6 my-8">
            <p className="text-lg font-semibold text-black italic">
              The makers of Daadi's Khakhra are the largest manufacturers of Khakhra in South India.
            </p>
          </blockquote>

          {/* Philosophy Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black mb-8 border-b-2 border-yellow-400 pb-2">
              OUR PHILOSOPHY
            </h2>
            
            <div className="space-y-8">
              {/* Vision */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-black mb-3">Vision</h3>
                <p className="text-black">
                  Our vision is to provide our consumers a convenient and wholesome eating experience with a range of traditional, healthy, tasty and innovative eatables, prepared with natural ingredients and flavours in a hygienic environment
                </p>
              </div>

              {/* Mission */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-black mb-3">Mission</h3>
                <p className="text-black">
                  To promote healthy living through healthy eating in a hygienic environment.
                </p>
              </div>

              {/* Values */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-black mb-3">Values</h3>
                <p className="text-black">
                  We value integrity, respect for stakeholders, creativity and innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
