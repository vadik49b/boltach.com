# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rails 8.1 application using SQLite3 with Solid Cache, Solid Queue, and Solid Cable for production. Features custom authentication system with session management and password reset functionality. Uses Tailwind CSS 4 for styling and Hotwire (Turbo + Stimulus) for interactivity.

## Development Commands

### Setup and Server
- `bin/setup` - Initial setup (install dependencies, create database, run migrations)
- `bin/dev` - Start development server with Foreman (Rails server on port 3000 + Tailwind watcher)
- `bin/rails server` - Start Rails server only (without CSS watcher)
- `bin/rails console` - Open Rails console
- `bin/rails tailwindcss:watch` - Watch and compile Tailwind CSS changes

### Database
- `bin/rails db:migrate` - Run pending migrations
- `bin/rails db:reset` - Drop, create, migrate, and seed database
- `bin/rails db:rollback` - Rollback last migration
- `bin/rails db:seed` - Load seed data

### Testing
- `bin/rails test` - Run all tests in parallel
- `bin/rails test test/controllers/sessions_controller_test.rb` - Run single test file
- `bin/rails test test/controllers/sessions_controller_test.rb:10` - Run specific test by line number

### Code Quality
- `bin/rubocop` - Run RuboCop linter (uses rails-omakase style guide)
- `bin/rubocop -a` - Auto-correct RuboCop offenses
- `bin/brakeman` - Run security vulnerability scanner

### Deployment
- `bin/kamal deploy` - Deploy application using Kamal
- `bin/kamal setup` - Initial server setup for Kamal deployment

## Architecture

### Authentication System

Cookie-based session authentication implemented via `Authentication` concern (app/controllers/concerns/authentication.rb):

- **Session Management**: Sessions stored in database with IP address and user agent tracking
- **Current Context**: `Current` (ActiveSupport::CurrentAttributes) provides thread-safe access to current session/user
- **Protected by Default**: All controllers inherit from `ApplicationController` which includes `Authentication` concern and requires authentication via `before_action :require_authentication`
- **Opt-out Pattern**: Use `allow_unauthenticated_access` class method to bypass authentication for specific actions

**Key Methods**:
- `authenticated?` - Check if user is authenticated
- `start_new_session_for(user)` - Create new session and set signed cookie
- `terminate_session` - Destroy current session and remove cookie
- `after_authentication_url` - Redirect URL after successful authentication (uses `session[:return_to_after_authenticating]`)

### Database Schema

**Users**:
- `email_address` (unique, normalized to lowercase)
- `password_digest` (bcrypt)
- Has many sessions

**Sessions**:
- Belongs to user
- Tracks `ip_address` and `user_agent`
- Used for multi-device session management

**Production Multi-Database Setup**:
- Primary: Main application data
- Cache: Solid Cache storage
- Queue: Solid Queue jobs
- Cable: Solid Cable messages

### Testing Helpers

`SessionTestHelper` (test/test_helpers/session_test_helper.rb) provides authentication helpers for integration tests:
- `sign_in_as(user)` - Authenticate as specific user in tests
- `sign_out` - Clear authentication in tests

## Key Patterns

### Rate Limiting
Controllers use Rails 8 rate limiting: `rate_limit to: 10, within: 3.minutes, only: :action`

### Password Reset Flow
1. User requests reset via `PasswordsController#create`
2. `PasswordsMailer.reset(user)` sends email with signed token
3. Token verified in `set_user_by_token` using `find_by_password_reset_token!`
4. All user sessions destroyed on successful password update

### Modern Browser Enforcement
`ApplicationController` includes `allow_browser versions: :modern` to restrict to browsers supporting webp, web push, badges, import maps, CSS nesting, and CSS :has.
