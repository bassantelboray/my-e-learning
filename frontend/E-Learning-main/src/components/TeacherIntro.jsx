import React from 'react';

const TeacherIntro = () => {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            👨‍🏫 تعريف المعلم
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              الأستاذ مجدي جمال هو مدرس  اول مادة الرياضة، يشرح لطلاب الصف الأول والثاني والثالث الثانوي 
                بأسلوب واضح وممتع يساعد على الفهم السريع والمرن  والتفوق كما قال المستر الواحد مننا بالف.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 space-x-reverse text-primary-600 dark:text-primary-400">
                <span className="text-2xl">🎓</span>
                <span className="font-medium">خبرة في التدريس</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-secondary-600 dark:text-secondary-400">
                <span className="text-2xl">📊</span>
                <span className="font-medium">نتائج متميزة</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-success-600 dark:text-success-400">
                <span className="text-2xl">💡</span>
                <span className="font-medium">أسلوب مبتكر</span>
              </div>
            </div>
            
            <button 
              onClick={scrollToCourses} 
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🔍 تعرف أكثر
            </button>
          </div>
          
          <div className="relative animate-slide-down">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl transform rotate-3"></div>
            <img 
              src="/imageTeacher2.jpg" 
              alt="الأستاذ مجدي جمال" 
              className="relative w-full h-[450px] object-cover object-center rounded-2xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">4.9/5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">تقييم الطلاب</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherIntro;