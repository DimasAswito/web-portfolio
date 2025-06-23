import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ContactSection() {
  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchContact = async () => {
      const { data, error } = await supabase.from('contact').select('*').single();
      if (error) {
        console.error('Error fetching contact:', error);
      } else {
        setContact(data);
      }
    };
    fetchContact();
  }, []);
  const handleChange = (e) => {
    const { id, value } = e.target; setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      alert('Please fill in all fields!');
      return;
    }

    const { error } = await supabase.from('qna').insert([{ name, email, message }]);

    if (error) {
      console.error('Error submitting message:', error.message);
      alert('Failed to send message.');
    } else {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">Get In Touch</h2>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Contact Information</h3>
            {contact ? (
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-envelope text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-primary transition duration-300">{contact.email}</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-phone text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <a href={`wa.me/${contact.phone}`} className="text-gray-300 hover:text-primary transition duration-300">{contact.phone}</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-gray-300">{contact.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <i className="fab fa-linkedin text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">LinkedIn</h4>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition duration-300">{contact.linkedin}</a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">Loading contact information...</p>
            )}
            {contact && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Follow Me</h3>
                <div className="flex space-x-6">
                  {contact.github && (
                    <a href={contact.github} className="text-3xl text-primary hover:text-blue-400 transition duration-300">
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                  {contact.instagram && (
                    <a href={contact.instagram} className="text-3xl text-primary hover:text-blue-400 transition duration-300">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {contact.facebook && (
                    <a href={contact.facebook} className="text-3xl text-primary hover:text-blue-400 transition duration-300">
                      <i className="fab fa-facebook"></i>
                    </a>
                  )}
                  {contact.linktree && (
                    <a href={contact.linktree} className="text-3xl text-primary hover:text-blue-400 transition duration-300">
                      <i className="fas fa-link"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            <form className="bg-dark rounded-xl p-8 shadow-lg" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-semibold mb-6 text-primary">Send Me a Message</h3>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter your name" />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium">Your Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter your email" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium">Your Message</label>
                <textarea id="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter your message"></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-dark font-medium rounded-lg hover:bg-blue-400 transition duration-300">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
