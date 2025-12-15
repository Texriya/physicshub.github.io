// app/(core)/physics/ProjectileMotion.js
// No 'import p5' at the top!

import { SCALE } from "../constants/Config.js";

// A custom class for 2D motion
export default class ProjectileMotion {
  constructor(p, x, y, mass) {
    this.p = p; // Store the p5 instance
    
    this.state = {
      pos: p.createVector(x, y), // Use p.createVector
      vel: p.createVector(0, 0),
      acc: p.createVector(0, 0),
    };
    this.mass = mass;
    this.radius = 0.5;
    this.color = "#7f7f7f";
    this.groundY = y;
    this.isDragging = false; // Make sure this is initialized
  }

  // Apply a force (as a p5.Vector)
  applyForce(force) {
    // F = ma -> a = F/m
    // FIX 1: Use p5.Vector.div() to create a new vector
    let f = this.p.constructor.Vector.div(force, this.mass);
    this.state.acc.add(f);
  }

  // Update position
  update(dt) {
    // FIX 2 & 3: Use p5.Vector.mult() to create new vectors
    this.state.vel.add(this.p.constructor.Vector.mult(this.state.acc, dt));
    this.state.pos.add(this.p.constructor.Vector.mult(this.state.vel, dt));
    this.state.acc.mult(0); // Clear acceleration
  }

  // Draw the projectile
  show(layer) {
    const p = layer || this.p;
    p.noStroke();
    p.fill(this.color);
    
    const screenX = this.state.pos.x * SCALE;
    const screenY = this.state.pos.y * SCALE;
    
    p.circle(
      screenX,
      screenY,
      this.radius * SCALE * 2
    );
    
    // Draw slingshot line if dragging
    if (this.isDragging) {
      const groundScreenY = this.groundY * SCALE;
      p.stroke(255, 255, 255, 150);
      p.strokeWeight(2);
      p.line(screenX, screenY, 0, groundScreenY); // Line from ball to origin
    }
  }

  // --- Our new functions ---

  launch(velocity, angle) {
    this.state.pos.set(0, this.groundY);
    this.state.acc.set(0, 0);

    const angleRad = this.p.radians(-angle); 
    // FIX 4: Use p5.Vector.fromAngle()
    this.state.vel = this.p.constructor.Vector.fromAngle(angleRad);
    this.state.vel.setMag(velocity);
  }
  
  // Check if we're on the ground
  isOnGround() {
    return this.state.pos.y > this.groundY - 0.01;
  }

  // Stop the projectile
  stop() {
    this.state.pos.y = this.groundY;
    this.state.vel.set(0, 0);
  }

  // Call this when the mouse is pressed
  clicked(mx, my) {
    const mouseMeters = this.p.createVector(mx / SCALE, my / SCALE);
    const d = this.p.dist(mouseMeters.x, mouseMeters.y, this.state.pos.x, this.state.pos.y);

    if (d < this.radius) {
      this.isDragging = true;
      return true;
    }
    return false;
  }

  // Call this when the mouse is released
  stopDragging() {
    this.isDragging = false;
  }

  // Call this when the mouse moves while pressed
  drag(mx, my) {
    if (!this.isDragging) return;

    this.state.vel.set(0, 0);
    this.state.pos.x = mx / SCALE;
    this.state.pos.y = my / SCALE;
  }

  // A new function to get the launch vector from the origin
  getLaunchVector(originX, originY) {
    let launchVec = this.p.createVector(originX, originY);
    launchVec.sub(this.state.pos); 
    // Return vector from projectile position to origin (in meters).
    // Do not apply arbitrary scaling here — let the caller decide mapping to velocity.
    return launchVec;
  }
}