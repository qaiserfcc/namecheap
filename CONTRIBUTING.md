# Contributing Guide

Thank you for considering contributing to the Multi-Brand E-commerce Platform!

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/namecheap.git
   cd namecheap
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Define types explicitly
- Avoid `any` type

### Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions**: camelCase (e.g., `calculatePrice`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Maximum line length: 100 characters
- Use meaningful variable names

### Backend (NestJS)
```typescript
// Good
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(brandId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { brandId },
    });
  }
}

// Bad
export class ProductsService {
  findAll(b) {
    return this.prisma.product.findMany({ where: { brandId: b } });
  }
}
```

### Frontend (React/Next.js)
```typescript
// Good
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <PriceComparison price={product.priceComparison} />
    </div>
  );
}

// Bad
export default function ProductCard(props) {
  return <div>{props.product.name}</div>;
}
```

## Architecture Rules

### Critical Rules (NEVER BREAK)

1. **Price Calculation**
   - ✅ ALWAYS calculate prices on the server
   - ❌ NEVER calculate prices on the client
   - Use `ProductsService.calculatePriceComparison()`

2. **Brand Isolation**
   - ✅ ALWAYS validate brandId in services
   - ✅ ALWAYS use BrandIsolationGuard
   - ❌ NEVER allow cross-brand queries

3. **Authentication**
   - ✅ ALWAYS hash passwords with bcrypt
   - ✅ ALWAYS use JWT guards on protected routes
   - ❌ NEVER store passwords in plain text

4. **Database Access**
   - ✅ ALWAYS use Prisma ORM
   - ✅ ALWAYS use transactions for multi-step operations
   - ❌ NEVER use raw SQL (unless approved)

## Git Workflow

### Branch Naming
- Feature: `feature/add-payment-gateway`
- Bug fix: `bugfix/fix-price-calculation`
- Hotfix: `hotfix/security-patch`
- Chore: `chore/update-dependencies`

### Commit Messages
Follow conventional commits:
```
feat: add payment gateway integration
fix: correct price comparison calculation
docs: update API documentation
chore: update dependencies
refactor: improve order service
test: add product service tests
```

### Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   cd backend && npm test
   cd ../frontend && npm test
   ```

3. **Create pull request**
   - Clear title and description
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **Address review comments**
   - Make requested changes
   - Push updates
   - Re-request review

## Testing

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm test:watch           # Watch mode
npm test:cov             # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm test:watch           # Watch mode
```

### Writing Tests

**Backend Example:**
```typescript
describe('ProductsService', () => {
  it('should calculate price comparison correctly', () => {
    const product = {
      officialPrice: 2500,
      discountedPrice: 1999,
    };
    
    const result = service.calculatePriceComparison(product);
    
    expect(result.priceComparison.savings).toBe(501);
    expect(result.priceComparison.savingsPercentage).toBe(20.04);
  });
});
```

## Database Migrations

### Creating a Migration
```bash
cd backend
npx prisma migrate dev --name add_new_feature
```

### Migration Guidelines
- Keep migrations small and focused
- Test migrations on dev database first
- Never modify existing migrations
- Always include rollback strategy in PR description

## Documentation

### Code Comments
- Comment WHY, not WHAT
- Use JSDoc for public APIs
- Keep comments up to date

```typescript
/**
 * Calculates price comparison between official and discounted prices.
 * This is a server-side operation only - frontend must never calculate prices.
 * 
 * @param product - Product with pricing information
 * @returns Product with calculated price comparison
 */
private calculatePriceComparison(product: Product): ProductWithComparison {
  // Implementation
}
```

### API Documentation
- Update Swagger annotations for new endpoints
- Include request/response examples
- Document error cases

## Security

### Security Checklist
- [ ] No hardcoded secrets
- [ ] Environment variables for configuration
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use Prisma)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting (for public endpoints)

### Reporting Security Issues
- Email: security@example.com
- Do NOT create public issues for security vulnerabilities

## Performance

### Performance Guidelines
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries
- Use lazy loading for images

## Code Review

### As a Reviewer
- Be respectful and constructive
- Focus on code quality, not style preferences
- Test the changes locally
- Check for security issues
- Verify tests are included

### As an Author
- Respond to all comments
- Don't take feedback personally
- Ask for clarification if needed
- Update PR description if scope changes

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Deploy to staging
6. Test on staging
7. Merge to main
8. Tag release
9. Deploy to production
10. Monitor logs

## Need Help?

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🎉
