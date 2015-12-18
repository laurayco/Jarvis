#ifndef __nlp_hpp__
#define __nlp_hpp__
#include <vector>
#include <string>

namespace NaturalLanguage {

  class Sentence;
  class Conversation;
  class Context;
  struct Connotation;

  class Sentence {
  protected:
    std::vector<std::string> words;
    void tokenize(char*);
  public:
    typedef std::vector<std::string>::iterator iterator;
    typedef const std::vector<std::string>::iterator const_iterator;
    std::vector<std::string>::iterator begin();
    std::vector<std::string>::iterator end();
    Sentence(const char*);
    Sentence(const std::string&);
    virtual ~Sentence();
  };

  struct Connotation {
    enum Kind {
      Good,
      Neutral,
      Bad
    };
  public:
    Kind value;
    double weight;
  };

  class Context {
    const Connotation get_connotation(const char*);
    virtual ~Context();
  };

  class Conversation {
  protected:
    std::vector<Sentence> statements;
    Context context;
  };

}

#endif
