#ifndef __nlp_hpp__
#define __nlp_hpp__
#include <vector>
#include <string>

namespace NaturalLanguage {

  class Sentence;
  class Conversation;
  class Context;

  class Sentence {
  protected:
    std::vector<std::string> words;
    void tokenize(const char*);
  public:
    Sentence(const char*);
    Sentence(const std::string&);
    virtual ~Sentence();
  };

  class Conversation {
  protected:
    std::vector<Sentence> statements;
    Context context;
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
  };

}

#endif
