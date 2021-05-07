<h1>Ivy</h1>

<h2>Getting Started</h2>
- Install Docker


<h2>Low Code Application Development</h2>

Ivy is a low code application service build on top of docker that allows nodes to be implemented to be re-used 
and modular.

Ivy begins with a graph defined in an `ivy.config.yml` file in the root directory of your project.  

<h2>Configuration File</h2>

You must have a configuration file in the directory called `ivy.config.yml`

Ivy will read from this file and execute a pre-defined set of steps defined in the graph.

You must provide a list of **nodes** that make up the graph. Each defined node must have an associated 
docker image that properly implements the ivy interface. 

```yml
nodes:
  - node_1:
      image: 'ivy/ebay'
      params:
        q: 'pokemon cards'
  - node_2:
      image: 'ivy/email'
      params: 
        to: 'kmfranz.developer@gmail.com'
```

The above graph consists of two nodes, the first is an ebay node that will hit an ebay api, conduct the search with the params given for `q` and save those into the 
graph state.

The next node is the `ivy/email` node, which be default will send an email out with the previous node's data response in tabular form.  
This simple configuration sets up a very quick solution to get automated updates from ebay.

