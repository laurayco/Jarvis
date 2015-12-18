mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))
BIN:= $(shell basename $(current_dir))
SOURCES:= $(shell find 'src' -name '*.cpp')
OBJECTS:= $(patsubst src/%.cpp,tmp/%.o,$(SOURCES))
CPP:=g++
CFLAGS:= std=c++0x
CFLAGS:= $(addprefix -,$(CFLAGS)) -I ./include
ALL:=$(BIN)

ALL:$(ALL)

clean:
	@rm tmp/* $(BIN) -rf|| true

rebuild:clean $(ALL)

run:
	@./$(BIN)

$(BIN):$(OBJECTS)
	@$(CPP) -o $@ $^ $(CFLAGS)

tmp/%.o:src/%.cpp
	@$(CPP) -c -o $@ $^ $(CFLAGS)
