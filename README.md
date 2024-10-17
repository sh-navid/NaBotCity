# RuX


## ARobot
![](/Documents/Screenshots/ARobot.png)

## Swarm Robot Simulator (SRS)
![](/Documents/Screenshots/V1.png)

## RuX Modules
- SRS
- AI
    - Hub
    - Services
    - Concepts
- Nabot (Assistant)

## SRS Clean Architecture
- Core
    - Contains the business logic
    - Independent of other layers
    - Outer layers depends on abstractions defined in inner layers
- Application
    - Manages data flow between core and other layers
- Infrastructure
    - Implements interfaces defined in core
    - Deals wiht databases, ...
- Presentation
    - UI
    - Controllers/endpoints


