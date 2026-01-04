import { motion } from 'framer-motion';
import { CodeIcon, PaletteIcon, BriefcaseIcon, ArrowRightIcon } from 'lucide-react';

const features = [{
  icon: CodeIcon,
  title: 'Web Development',
  description: 'Creating responsive websites and web applications with modern frameworks.'
}, {
  icon: PaletteIcon,
  title: 'UI/UX Design',
  description: 'Designing intuitive user interfaces and seamless user experiences.'
}, {
  icon: BriefcaseIcon,
  title: 'Project Management',
  description: 'Leading projects from conception to completion with agile methodologies.'
}];

export default function AboutMe() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="about" className="py-16 sm:py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 px-2">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 px-2 sm:px-0"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Passionate Developer & Creative Designer
            </h3>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I'm a full-stack developer with a passion for creating beautiful,
              functional, and user-centered digital experiences. With over 5
              years of experience in web development, I specialize in building
              modern web applications that solve real-world problems.
            </p>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              My approach combines technical expertise with creative
              problem-solving to deliver solutions that not only meet
              requirements but exceed expectations. I believe in continuous
              learning and staying up-to-date with the latest technologies and
              best practices.
            </p>
            <button 
              onClick={scrollToContact}
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto justify-center"
            >
              <span className="text-sm sm:text-base">Get in Touch</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow mx-2 sm:mx-0"
              >
                <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}