import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * User login endpoint
   * Validates email and password, returns JWT token
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password, returns JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Register new user
   * Creates a new user account with VIEWER role by default
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  /**
   * Get current user profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve the current authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
  })
  async getCurrentUser(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }

  /**
   * Validate token
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validate token',
    description: 'Verify if the provided JWT token is valid',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  async validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }
}
