# **Redesign of ''Wheels of Fortune''**

## **Instruction of Work**
- ### **Introduction**  
  Initially, the particles gradually fade in to generate and form a circle, while in the formation of the circle, 3 rings are generated in order from the inside to the outside, at the end of the generation, all the circles will have particles of different colors, and they are merged to form a larger circle, which will change color at high frequency until it disappears in the following time.

## **Details of Work**
- ### **Running Style**  
  
  The driving source for this project is **time**.
- ### **Animation Introduction**
  
  In this project, the process of generating each **circle and ring**, as well as the process of merging them into one **large circle**, will be animated. Except for the fact that the color and size of each circle will be different from the group's work, I remade most of the code so that the particle system can follow the pattern of **“Generate multiple circles of different colors - merge them into one big circle - big circle”. keep changing colors until it disappears”** loop to play the animation.
  
  So, I made small changes to the group code regarding the layout and color of the circle arrangement, but for the animation aspect and visual effects I made a lot of changes
- ### **Group Members Animation Introduction**
  **Jackie**：Dynamically change the radius size of the circles and the color of the dots based on the energy of the music.

  **Mere**：Perlin noise is used to randomize the initial position of each circle, as well as randomize the size and the circle. Also randomly generated are the colors of the inner circles.

  **Ann**：Circles and patterns switch positions on mouse click.

- ### **Inspiration**
  
  This project was largely inspired by these two images, and as I mentioned in my Week8 assignment, I think the **particle system** is very applicable to this assignment project, although ultimately my choice was not an audio driver.
  
  Initially my plan was to go with oil paintings, but in the end we went with circles. However this does not affect the way I categorize, in oil paintings one can simply categorize by **color**, such as dark colors, medium tones of color, and light colors, however in the circle piece I think it can be categorized by **structure**, such as **rings and circles**. In addition to this, something like a ball of thread in the original work can be made to move separately.
![Pacita Abad Wheels of fortune](./images/inspiration3.png)
![inspiration2](./images/inspiration2.png)
![inspiration1](./images/inspiration1.png)

- ### **Technical Details**  
  Regarding the final version of the scheme, the main technical difficulties are firstly how to make the particles move and merge in position through the algorithm, and secondly the color change.

  The position of each circle will be changed to be controlled by the algorithm through centerX and centerY, and the lerp will be used to change the position of center when the circles are aggregated together, and the original classParticle and classRingParticle will be changed to do the change according to the position of center accordingly, and at the same time, the radius of the circle will be changed accordingly to do the effect of circle enlargement. At the same time, the radius of the circle will also be changed accordingly, so that the effect of circle enlargement can be achieved.

  First change the color selection logic, no longer use a fixed color (red and white), but use a random color pool, and when all the circles are merged, a judgment logic is needed to change the color (white is fixed), so in the classparticle I added a type to distinguish whether it is white or color.

  See the code comments for details.

  - **Reference:**

    The Coding Train. (n.d.). Noise with oscillation [Video]. YouTube. https://www.youtube.com/watch?v=QlpadcXok8U

    The Coding Train. (n.d.). Perlin noise flow field [Online code editor]. p5.js. https://editor.p5js.org/codingtrain/sketches/D4ty3DgZB

    The Coding Train. (n.d.). Coding challenge: Perlin noise in 1D [Video]. YouTube. https://www.youtube.com/watch?v=yAyiQKNVtY8

    HelloWorld. (2020, October 9). How to use Perlin noise to create a 2D particle system [Video]. Bilibili. https://www.bilibili.com/video/BV1rH4y1m7fb

    CoderAyu. (2020, September 18). Creating dynamic particle effects using p5.js [Video]. Bilibili. https://www.bilibili.com/video/BV1De411U7nu

    Weixin_42134054. (n.d.). Particle effect resource files [Download]. CSDN. https://download.csdn.net/download/weixin_42134054/19042282

   - **Acknowledgements:**
  
     Thanks to my online tutor Sam from the Engineer's Forum (CSDN) for teaching me how to transform colors using spectra as well as reminding me to merge groups of numbers to call each particle system. Most importantly, he taught me how to properly blend particles and change colors, which I could not have done without his help.

      I would like to thank my team members for being accommodating and understanding of my choice to make extensive changes (almost refactoring) to the team's code, as well as my slow progress due to my choice of particle systems as a major part of the project, and for their understanding.

     Last but not least, I would like to thank my tutor Ryan, for the different inspirations in class and the final references to different artists on the canvas that motivated me to choose different artistic expressions to create the final project.