import en from './en';
import fr from './fr';
import zh from './zh';
import de from './de';
import ja from './ja';
import ko from './ko';
import ru from './ru';
import es from './es';

const languages = {
  en, fr, zh, de, ja, ko, ru, es,
};
const keys = Object.keys(languages);

keys.forEach((key) => {
  languages[key] = { ...en, ...languages[key] };
});

export default languages;
