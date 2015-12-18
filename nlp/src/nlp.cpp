#include "nlp.hpp"

using namespace NaturalLanguage;


/*
  Sentence class definition.
*/

Sentence::Sentence(const char* str) {
  tokenize((char*)str);
}

Sentence::Sentence(const std::string& str) {
  tokenize((char*)str.c_str());
}

static char* skip_spaces(char* str){
  while(isspace(*str)&&*str) str++;
  return str;
}

static char* skip_non_spaces(char* str) {
  while(!isspace(*str)&&*str) str++;
  return str;
}

static char* next_term(char* str) {
  return skip_spaces(skip_non_spaces(str));
}

Sentence::~Sentence() {
  return;
}

void Sentence::tokenize(char* str) {
  str = skip_spaces(str);
  while(*str) {
    char* end = skip_non_spaces(str);
    words.push_back(std::string(str,end - str));
    str = skip_spaces(end);
  }
}

std::vector<std::string>::iterator Sentence::begin() {
  return words.begin();
}

std::vector<std::string>::iterator Sentence::end() {
  return words.end();
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
