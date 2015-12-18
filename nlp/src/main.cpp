#include "nlp.hpp"
#include <iostream>

int main(const int argc,char** argv) {
  NaturalLanguage::Sentence sentence("hello mortal    this is life");
  for(auto it : sentence) {
    std::cout << it << std::endl;
  }
  return 0;
}
