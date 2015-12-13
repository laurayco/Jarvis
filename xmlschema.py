from xml.etree.cElementTree import iterparse

class StackDict:
    def __init__(self,default_value=None):
        self.path = []
        self.default = default_value or {}
        self.data = self.make_new_node()
        self.current_point = self.data
    def push(self,path):
        self.path.append(path)
        self.current_point = self.data
        exists = True
        for node in self.path:
            new_point = self.current_point['subchildren'].get(node)
            if new_point is None:
                exists = False
                print("Creating child",".".join(self.path),node)
                new_point = self.make_new_node()
                self.current_point['subchildren'][node] = new_point
            self.current_point = new_point
        return exists
    def make_new_node(self):
        new_node = {}
        new_node['subchildren'] = {}
        for name,val in self.default.items():
            new_node[name] = val() if callable(val) else val
        return new_node
    def pop(self):
        # previous path is implicitly gauranteed to exist.
        self.path.pop()
        self.current_point = self.data
        for node in self.path:
            self.current_point = self.current_point['subchildren'][node]
    def top(self):
        self.path = []
        self.current_point = self.data

def print_schema(schema,prefix=' '):
    for node in schema.current_point['subchildren'].keys():
        schema.push(node)
        print(prefix[1:],node,':',sep='')
        print(prefix[1:],schema.current_point['data'].__name__)
        if len(schema.current_point['attributes'])>0:
            print(prefix[1:],"attributes->")
            for attr, kind in schema.current_point['attributes'].items():
                print(prefix+' ',attr,':',kind.__name__)
        if len(schema.current_point['subchildren']) > 0:
            print(prefix[1:],"children->")
            print_schema(schema,prefix + prefix[0] * 2)
        schema.pop()

class NoData:pass

def analyze(f,schema):
    block_size = 1024
    def identify_data_type(txt):
        try:
            txt = int(txt)
            return int
        except:
            return NoData if txt is None or (isinstance(txt,str) and len(txt)<1) else str
        return NoData
    for event, el in iterparse(fn,('start','end')):
        if event=='start':
            if schema.push(el.tag):
                continue
            if schema.current_point['data'] is None or schema.current_point['data'] is NoData:
                schema.current_point['data'] = identify_data_type(el.text if len(el)<1 else None)
            for attr_name,attr_val in el.items():
                if not attr_name in schema.current_point['attributes']:
                    schema.current_point['attributes'][attr_name] = identify_data_type(attr_val)
        elif event=='end':
            schema.pop()
            el.clear()
    print("Calculated schema:")
    schema.top()
    return schema

if __name__=="__main__":
    import json, sys

    class TypeEncoder(json.JSONEncoder):
        def default(self,obj):
            if isinstance(obj,type):
                return {
                    int:'int',
                    float:'double',
                    NoData:None,
                    str:'string'
                }[obj]
            return super().default(obj)
    schema = StackDict({
        'attributes':dict,
        'data':None
    })
    for fn in sys.argv:
        if fn[fn.rfind(".")+1:].lower()!='xml':
            continue
        try:
            analyze(open(fn),schema)
        except:
            pass
        finally:
            print("Saving schema")
            schema.top()
            print_schema(schema)
            #with open(fn[:fn.rfind(".")]+"-structure.json",'w') as f:
            #    json.dump(schema.data,f,cls=TypeEncoder,indent=2)
