import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupUser, verifyOtpUser } from '../redux/slices/authSlice';
import MathBackground from '../components/MathBackground';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    phone: '',
    location: '',
    code: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [registrationData, setRegistrationData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الرباعي مطلوب';
    } else if (formData.name.trim().length < 5 || formData.name.trim().length > 100) {
      newErrors.name = 'الاسم يجب أن يكون بين 5 و 100 حرف';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'يجب أن يحتوي الاسم على كلمتين على الأقل';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (!formData.grade) {
      newErrors.grade = 'الصف الدراسي مطلوب';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^(010|011|012|015)\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 010, 011, 012, أو 015)';
    }


    if (!formData.location) {
      newErrors.location ='المركز مطلوب';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'كود الطالب مطلوب';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({}); // مسح الأخطاء السابقة
    
    try {
      // إرسال البيانات المطلوبة فقط
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        phone: formData.phone,
        location: formData.location,
        code: formData.code
      };
      
      const response = await dispatch(signupUser(userData)).unwrap();
      
      // حفظ بيانات التسجيل وعرض شاشة OTP
      setRegistrationData(response);
      setShowOtpVerification(true);
      
    } catch (error) {
      console.log('Registration error:', error);
      
      // التعامل مع أخطاء التحقق من الباك إند
      if (error.errors && Array.isArray(error.errors)) {
        const backendErrors = {};
        error.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ submit: error.message || 'حدث خطأ أثناء إنشاء الحساب' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpCode.trim()) {
      setErrors({ otp: 'رمز التحقق مطلوب' });
      return;
    }
    
    if (otpCode.length !== 6) {
      setErrors({ otp: 'رمز التحقق يجب أن يكون 6 أرقام' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('محاولة التحقق من OTP:', otpCode);
      console.log('OTP المتوقع:', registrationData?.otp);
      
      // استدعاء API للتحقق من OTP
      const otpData = {
        email: formData.email,
        otp: otpCode.trim()
      };
      
      await dispatch(verifyOtpUser(otpData)).unwrap();
      
      navigate('/login', { 
        state: { 
          message: 'تم إنشاء الحساب وتفعيله بنجاح! يرجى تسجيل الدخول',
          email: formData.email
        }
      });
    } catch (error) {
      console.error('خطأ في التحقق من OTP:', error);
      setErrors({ otp: error.message || 'رمز التحقق غير صحيح' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // هنا يجب إضافة API call لإعادة إرسال OTP
    console.log('إعادة إرسال OTP');
  };

  if (showOtpVerification) {
    console.log('عرض شاشة التحقق من OTP');
    console.log('registrationData:', registrationData);
    console.log('OTP المستلم:', registrationData?.otp);
    
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <MathBackground />
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تأكيد البريد الإلكتروني</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني
              </p>
              {registrationData?.otp && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                    لأغراض التطوير - رمز التحقق:
                  </p>
                  <div className="text-center">
                    <span className="inline-block bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 font-bold text-2xl px-4 py-2 rounded border-2 border-green-300 dark:border-green-600 tracking-widest">
                      {registrationData.otp}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {errors.otp && (
              <div className="bg-error-50 dark:bg-error-900 border border-error-200 dark:border-error-700 text-error-800 dark:text-error-300 px-4 py-3 rounded-lg mb-4">
                {errors.otp}
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رمز التحقق
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white text-center text-lg"
                  placeholder="أدخل رمز التحقق"
                  maxLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  إعادة إرسال الرمز
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowOtpVerification(false)}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  العودة للتسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <MathBackground />
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إنشاء حساب جديد</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">انضم إلى منصة بداية التعليمية</p>
          </div>

          {errors.submit && (
            <div className="bg-error-50 dark:bg-error-900 border border-error-200 dark:border-error-700 text-error-800 dark:text-error-300 px-4 py-3 rounded-lg mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كود الطالب
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.code 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أدخل كود الطالب الذي حصلت عليه من الإدارة"
              />
              {errors.code && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.code}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الاسم الرباعي
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.name 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أدخل الاسم الرباعي كاملاً"
              />
              {errors.name && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.email 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أدخل البريد الإلكتروني"
              />
              {errors.email && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.phone 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أدخل رقم الهاتف"
              />
              {errors.phone && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المركز
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.location 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              >
                <option value="">اختر المركز</option>
                <option value="العسيرات">العسيرات</option>
                <option value="المنشاة">المنشاة</option>
                <option value="الأجايوة">الأجايوة</option>
              </select>
              {errors.location && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.location}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الصف الدراسي
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.grade 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              >
                <option value="">اختر الصف الدراسي</option>
                <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                <option value="الصف الثاني الثانوي علمي">الصف الثاني الثانوي علمي</option>
                <option value="الصف الثاني الثانوي ادبي">الصف الثاني الثانوي ادبي</option>
                <option value="الصف الثالث الثانوي علمي">الصف الثالث الثانوي علمي</option>
                <option value="الصف الثالث الثانوي ادبي">الصف الثالث الثانوي ادبي</option>
              </select>
              {errors.grade && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.grade}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.password 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أدخل كلمة المرور"
              />
              {errors.password && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.confirmPassword 
                    ? 'border-error-500 focus:ring-error-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="أعد إدخال كلمة المرور"
              />
              {errors.confirmPassword && (
                <span className="text-error-600 dark:text-error-400 text-sm mt-1 block">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              لديك حساب بالفعل؟ <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;