# README for DBSCAN

## Purpose
This repository creates a tool to help visualize and understand the **D**ensity-**B**ased **S**patial **C**lustering of **A**pplications and **N**oise (DBSCAN) algorithm.

An online version of this tool can be found at https://kiwidamien.github.io/dbscan/

A description of the DBSCAN algorithm can also be found on [wikipedia](https://en.wikipedia.org/wiki/DBSCAN).

## Recommended order

This tool identifies the cluster regardless of the state of the controls. The order below is an order that closely follows the steps in the DBSCAN algorithm.

1. Uncheck all checkboxes. This is your "raw" data.
2. Hit the "Show all" button. This will show the neighborhood of every point. The size of the neighborhood can be controlled by the &epsilon; slider.
3. Click the "Show numbers" checkbox. The first number by each point is the number of neighbors it has (i.e. the number of points, including itself, in its neighborhood). The second number, if it exists, is the cluster # it belongs to. Ignore for now -- at this point DBSCAN hasn't assigned clusters.
4. Show the neighborhoods for "Core points", but not for "border" or "noise" points. A _core point_ is any point with at least _minPoints_ (controlled by the "Minimum points in a cluster" slider) in its neighborhood.
5. Click "Show color for different clusters". You will see all core points in the neighborhood of another core point are assigned the same cluster. There are also non-core points that lie in the neighborhood of a core point, called _border points_, that get assigned to the same cluster as the core point (they are "close enough" that our _spatial_ clustering algorithm assigns them to the same cluster)
6. Click "Show none". This will leave you with the points and their cluster identification. This is what the output of DBSCAN would be.

The data points are randomly generated. If you refresh the page, you will have a new set of data points.

## Visualizing the effect of the parameters

Once you have an understanding of the steps of the algorithm, try changing the sliders to see how changing &epsilon; and _minPoints_ affects the cluster assignments.
 
## Quickstart

If you clone this repo to your local machine, you can run it with
```
npm start
```
