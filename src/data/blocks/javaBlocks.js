export const JAVA_BLOCKS = [
  `@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();
        return ResponseEntity.created(location).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}`,

  `@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    public User() {}
    
    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\\'' +
                ", email='" + email + '\\'' +
                ", createdAt=" + createdAt +
                "}";
    }
}`,

  `@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }
    
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }
    
    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }
        
        User user = new User(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())
        );
        
        User savedUser = userRepository.save(user);
        
        emailService.sendWelcomeEmail(savedUser);
        
        return savedUser;
    }
    
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = findById(id);
        
        user.setName(request.getName());
        
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
    
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = findById(id);
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query, Pageable pageable) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable);
    }
}`,

  `@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, Long id);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    List<User> findUsersByDateRange(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :date")
    Long countUsersRegisteredSince(@Param("date") LocalDateTime date);
}`,

  `@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .postCount(user.getPosts().size())
            .build();
    }
    
    public List<UserDto> toDtoList(List<User> users) {
        return users.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Note: password should be encoded by service layer
        return user;
    }
    
    public void updateEntityFromDto(User user, UpdateUserRequest request) {
        if (request == null) {
            return;
        }
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
    }
}`
];