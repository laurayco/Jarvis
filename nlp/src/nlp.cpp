#include "nlp.hpp"

using namespace NaturalLanguage;


/*
  Sentence class definition.
*/

Sentence::Sentence(const char* str) {
  tokenize(str);
}

Sentence::Sentence(const std::string& str) {
  tokenize(str.c_str());
}

Sentence::~Sentence() {
  return;
}

void Sentence::tokenize(const char* str) {
  return;
}

/*
  Conversation class definition.
*/

/*
  Context class definition.
*/

const Connotation Context::get_connotation(const char* str) {
  Connotation cnt;
  cnt.value = Connotation::Neutral;
  cnt.weight = 1.0;
  return cnt;
}
