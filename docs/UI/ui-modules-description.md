---
title: "UI Modules Description"
description: "Detailed breakdown of the four main navigation modules: Focus, Goals, Store, and Fitness."
workspace: "apps/mobile"
tags:
  - mobile
  - navigation
  - modules
  - ux
priority: 2
---

# 📱 UI Modules Description

1. Focus
    Description: Where all for today's tasks and a dashboard with overal progress
    Bottom tabs:
        - User Progress Screen (Firs screen when you open the app, after the login):
            List of cards with a Pizza Graph with overal User Progress, divided with a card for Goals and another for Fitness.
            A card today's events summary.     
        - Now Screen
            I want to improve this screen to have a better overrall UX 
        - Action Hub
            I want to improve this screen to have a better overrall UX 
    2. Goals Managenmt, 
    Description: This module is for creating, updating and general management of Meanings, Goals, Tasks, 
    Bottom tabs:
        - Goals Dashboard:
            List of all cards with a Pizza Graph with current task progress for each Goal.
        - Tasks and subtasks Backlog:
            show a list of all goals, and have some simple buttom filters
            FAB for adding new tasks - opens a modal or a new screen (depends on what you think is better for UX) to add a tasks with title (requirted), description(optional), icon, due Date with a calendar selection input with hours, categories select (multi-select), tags select (multi-select), related goal select (multi-select), a list of needed resources needed todo, and another list for the resouces that will be added with task completition 
        - Goals Backlog:
            show a list of all goals, and have some simple buttom filters
            FAB for adding new goals - opens a modal or a new screen (depends on what you think is better for UX) to add a goals with title (requirted), description(optional), icon,  due Date with a calendar selection input with hours, categories select (multi-select), tags select (multi-select), related Meanings select (multi-select), a list of needed resources needed todo, and another list for the resouces that will be added with Goal completition
        - Reflection Log (same as right now)
    3. Store
    Description: This module is for creating, updating and general management of Meanings, Goals, Tasks, 
    Bottom tabs:
        - Dashboard with resorces state
            show cards with the resoruces list (one card for each resource's category)
        - Management Store
            List of resorces with a category filter at the top
            FAB for adding new resources  
        - Audit for resources added and removed
    4. Fitness (only show taks with category "fitness" here)
        - Dashboard with progress of exercises by week, with a card showing the current progress of the and a list for todays's exercise
        - Execution screen, these should be a screen to help the user to see the way to do some exercise, I did not have the idea for it now, show me some possibilities
        - Planning exercises, here the user will add exercises ( this will be a special task with subtasks, each task will be a specific type or body part focus, and the sub tasks will be the exercises. but will be treat as a task by the app, but will have a category "fitness")
    5. User settings screen:
        - Here the user can change the Display name, color theme select(Light or dark mode), game modes (future feature, select disabled with "classic" selected) age and avatar photo
