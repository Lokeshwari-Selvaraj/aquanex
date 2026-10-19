package com.aquanex.backend.controller;

import com.aquanex.backend.entity.User;
import com.aquanex.backend.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // ==============================
    // REGISTER USER
    // ==============================

    @PostMapping
    public User registerUser(@RequestBody User user) {

        return userRepository.save(user);
    }


    // ==============================
    // LOGIN USER
    // ==============================

    @PostMapping("/login")
    public User loginUser(@RequestBody User loginUser) {

        User user =
                userRepository.findByEmail(loginUser.getEmail());

        if (user != null &&
            user.getPassword().equals(loginUser.getPassword())) {

            return user;
        }

        throw new RuntimeException("Invalid email or password");
    }
}