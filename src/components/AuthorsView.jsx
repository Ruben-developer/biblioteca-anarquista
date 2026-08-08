import React from 'react';
import PropTypes from 'prop-types';
import { Book } from 'lucide-react';
import { THEME } from '../constants';

const AuthorsView = ({ 
  darkMode, 
  authors
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <div>
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Biografías Anarquistas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.name} className={`${cardClass} border-2 rounded-lg p-6 shadow-md hover:shadow-xl transition-all`}>
            <div className="text-6xl mb-4 text-center">{author.image}</div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 text-center`}>
              {author.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-3 text-center`}>
              {author.years}
            </p>
            <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-600'} mb-3 text-center`}>
              📍 {author.region}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'} leading-relaxed`}>
              {author.bio}
            </p>
            <div className={`flex items-center justify-between pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-amber-300'}`}>
              <span className="text-sm">
                <Book size={16} className="inline mr-1" />
                {author.books} textos
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AuthorsView.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      years: PropTypes.string.isRequired,
      region: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      books: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired
};

export default AuthorsView;
