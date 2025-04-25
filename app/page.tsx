import Link from "next/link"
import { FuelIcon as GasPump, ArrowRight, CheckCircle, BarChart3, CreditCard, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GasPump className="h-6 w-6" />
            <span className="text-xl font-bold">Hardy Station</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register-company">
              <Button>Register Company</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-muted">
        <div className="w-full px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center max-w-[2000px] mx-auto">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  New Features Available
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-gradient">
                  Streamline Your Filling Station Operations
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Hardy Station provides a comprehensive management system for filling stations, helping you track
                  sales, manage inventory, and optimize your business.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/register-company">
                  <Button size="lg" className="gap-2 shadow-lg hover:shadow-primary/50 transition-all duration-300">
                    Register Your Company
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="shadow-lg hover:shadow-muted transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background shadow-2xl transition-transform hover:scale-105 duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GasPump className="h-32 w-32 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="w-full bg-gradient-to-b from-background via-muted/50 to-background py-12 md:py-24 lg:py-32">
        <div className="w-full px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage your filling station efficiently
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:grid-cols-6 max-w-[2000px] mx-auto">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <GasPump className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Meter Reading Tracking</h3>
              <p className="text-center text-muted-foreground">
                Accurately track pump meter readings and calculate fuel sales volumes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Payment Management</h3>
              <p className="text-center text-muted-foreground">
                Handle multiple payment methods including cash, POS, and bank transfers.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Staff Management</h3>
              <p className="text-center text-muted-foreground">
                Manage shifts, track performance, and assign responsibilities to your team.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Financial Reporting</h3>
              <p className="text-center text-muted-foreground">
                Generate comprehensive reports on sales, expenses, and profits.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Expense Tracking</h3>
              <p className="text-center text-muted-foreground">
                Record and categorize all business expenses with approval workflows.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Cash Handovers</h3>
              <p className="text-center text-muted-foreground">
                Streamline end-of-day cash handover processes with verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-muted/5"></div>
        <div className="w-full px-4 md:px-8 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works best for your business
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4 max-w-[2000px] mx-auto">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-2xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Basic</h3>
                <p className="text-muted-foreground">For new stations</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₦30,000</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 5 users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic sales reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>1 terminal</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Daily sales tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic inventory management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/register-company" className="w-full">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="flex flex-col rounded-2xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Growth</h3>
                <p className="text-muted-foreground">For growing stations</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₦70,000</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 15 users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 3 terminals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Shift management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Inventory alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Sales analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Employee performance tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Cash flow monitoring</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/register-company" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Professional Plan - Highlighted */}
            <div className="flex flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Professional</h3>
                <p className="text-muted-foreground">For established businesses</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₦105,000</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 50 users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Custom reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 8 terminals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>24/7 phone support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Automated inventory management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Multi-location management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Real-time financial tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Automated reports & alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Business intelligence tools</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/register-company" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col rounded-2xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="text-muted-foreground">For large operations</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">Custom</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited terminals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Custom API access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Enterprise SLA</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced security features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Custom development</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority feature requests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Onsite training</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/register-company" className="w-full">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="testimonials" className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
        <div className="w-full px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Trusted by filling station owners across Nigeria
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 max-w-[2000px] mx-auto">
            <div className="flex flex-col rounded-lg border p-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1">
                <p className="text-muted-foreground">
                  "Hardy Station has transformed how we manage our filling station. The meter reading tracking and cash
                  management features have saved us countless hours and improved our accuracy."
                </p>
              </blockquote>
              <div className="mt-4 border-t pt-4">
                <div className="font-medium">Oluwaseun Adeyemi</div>
                <div className="text-sm text-muted-foreground">Owner, Adeyemi Fuels</div>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1">
                <p className="text-muted-foreground">
                  "The financial reporting in Hardy Station gives me complete visibility into our operations. I can now
                  make data-driven decisions that have increased our profitability by 15%."
                </p>
              </blockquote>
              <div className="mt-4 border-t pt-4">
                <div className="font-medium">Chioma Okafor</div>
                <div className="text-sm text-muted-foreground">Manager, Okafor Petroleum</div>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1">
                <p className="text-muted-foreground">
                  "As we expanded to multiple locations, Hardy Station made it easy to manage all our terminals from one
                  dashboard. The staff management features have been particularly valuable."
                </p>
              </blockquote>
              <div className="mt-4 border-t pt-4">
                <div className="font-medium">Ibrahim Musa</div>
                <div className="text-sm text-muted-foreground">CEO, Musa Oil & Gas</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="w-full px-4 md:px-8 grid items-center gap-6 lg:grid-cols-2 lg:gap-10 max-w-[2000px] mx-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Transform Your Filling Station Management?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Contact us today to learn more about how Hardy Station can help your business.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/register-company">
              <Button size="lg" className="gap-1">
                Register Your Company
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="mailto:info@hardystation.com">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <footer className="w-full border-t bg-background py-6">
        <div className="w-full px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:flex-row max-w-[2000px] mx-auto">
          <div className="flex items-center gap-2">
            <GasPump className="h-6 w-6" />
            <span className="text-lg font-bold">Hardy Station</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 Hardy Station. Hardy-Technologies All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

