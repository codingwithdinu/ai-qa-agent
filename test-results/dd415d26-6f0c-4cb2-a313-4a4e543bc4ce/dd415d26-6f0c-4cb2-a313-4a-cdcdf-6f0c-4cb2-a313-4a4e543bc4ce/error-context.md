# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dd415d26-6f0c-4cb2-a313-4a4e543bc4ce.spec.ts >> dd415d26-6f0c-4cb2-a313-4a4e543bc4ce
- Location: generated-tests\dd415d26-6f0c-4cb2-a313-4a4e543bc4ce.spec.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="toggle menu"]').first()
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for locator('[aria-label="toggle menu"]').first()

```

```yaml
- banner:
  - navigation:
    - link "Sophia Edu & IT Solutions logo Sophia Edu & IT Solutions Sophia Edu & IT Solutions":
      - /url: /
      - img "Sophia Edu & IT Solutions logo"
      - text: Sophia Edu & IT Solutions Sophia Edu & IT Solutions
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "About":
          - /url: /about
      - listitem:
        - link "Services":
          - /url: /services
      - listitem:
        - link "Internship":
          - /url: /internship
      - listitem:
        - link "Contact":
          - /url: /contact
    - link "Get Started":
      - /url: /contact
- main:
  - img
  - text: AI-Powered Solutions
  - heading "Empowering Businesses & Students with AI-Driven Technology Solutions" [level=1]
  - paragraph: We provide AI solutions, software development, digital services, internships, and modern education programs.
  - link "Get Started":
    - /url: /contact
    - text: Get Started
    - img
  - paragraph: Powering teams & learners across the globe
  - img "MyCivic"
  - img "iSTART"
  - img "MSME"
  - text: What we do
  - heading "Premium IT Services" [level=2]
  - paragraph: Full-stack digital expertise.
  - img
  - heading "AI / ML Solutions" [level=3]
  - paragraph: Custom AI models that move the needle.
  - img
  - heading "AI Powered SaaS Product" [level=3]
  - paragraph: End-to-end SaaS products powered by AI technology.
  - img
  - heading "Chatbots & Automation" [level=3]
  - paragraph: GPT-powered assistants & workflows.
  - img
  - heading "AI Integrated Web Development" [level=3]
  - paragraph: AI-powered websites with intelligent features & smart automation.
  - img
  - heading "AI Integrated App Development" [level=3]
  - paragraph: Mobile apps enhanced with AI capabilities & machine learning.
  - link "View all services":
    - /url: /services
    - text: View all services
    - img
  - heading "Ready to build something extraordinary?" [level=2]
  - paragraph: Whether you're a startup, enterprise, or student — let's create the future together.
  - link "Talk to us":
    - /url: /contact
    - text: Talk to us
    - img
  - img
  - text: Free consultation
  - img
  - text: Custom software solutions
  - img
  - text: Dedicated support Loved by clients & students
  - heading "What people are saying" [level=2]
  - img
  - paragraph: "\"The mentorship and live projects gave me real confidence.\""
  - text: Aarav Mehta Student · AI Internship
  - img
  - paragraph: "\"Sophia shipped our MVP in record time.\""
  - text: Priya Sharma CTO, FinNova
  - img
  - paragraph: "\"Their AI automation cut our support load by 60%.\""
  - text: Rahul Verma Founder, RetailHub
- contentinfo:
  - link "Sophia Edu & IT Solutions Sophia Edu & IT Solutions":
    - /url: /
    - img "Sophia Edu & IT Solutions"
    - text: Sophia Edu & IT Solutions
  - paragraph: Empowering businesses & students with AI-driven technology solutions and modern education programs.
  - link "linkedin":
    - /url: https://www.linkedin.com/company/sophia-edu-it-solutions/posts/?feedView=all
    - img
  - heading "Services" [level=4]
  - list:
    - listitem: AI / ML Solutions
    - listitem: AI Powered SaaS Product
    - listitem: Chatbots & Automation
    - listitem: AI Integrated Web Development
    - listitem: AI Integrated App Development
  - heading "Quick Links" [level=4]
  - list:
    - listitem:
      - link "About":
        - /url: /about
    - listitem:
      - link "Internship":
        - /url: /internship
    - listitem:
      - link "Contact":
        - /url: /contact
  - heading "Get in touch" [level=4]
  - list:
    - listitem:
      - img
      - text: info@sophia.edu-it.in
    - listitem:
      - img
      - text: +91 94145 61643
    - listitem:
      - img
      - text: Jodhpur, Rajasthan, India
  - paragraph: © 2026 Sophia Edu & IT Solutions. All rights reserved.
  - paragraph: Crafted with AI · Built for the future.
- link "Chat on WhatsApp":
  - /url: https://wa.me/919414561643
  - img
```

# Test source

```ts
  28  |         await locator.click({
  29  |             timeout: 3000,
  30  |         });
  31  | 
  32  |         return selector;
  33  | 
  34  |     } catch (error) {
  35  | 
  36  |         console.log(
  37  |             "⚠️ Selector failed:",
  38  |             selector
  39  |         );
  40  | 
  41  |         const healedSelector =
  42  |             await findBestSelector(
  43  |                 page,
  44  |                 selector
  45  |             );
  46  | 
  47  |         if (healedSelector) {
  48  | 
  49  |             await page.waitForSelector(
  50  |                 healedSelector,
  51  |                 {
  52  |                     timeout: 3000,
  53  |                     state: "attached",
  54  |                 }
  55  |             );
  56  | 
  57  |             const healedLocator =
  58  |                 page.locator(
  59  |                     healedSelector
  60  |                 ).first();
  61  | 
  62  |             await healedLocator
  63  |                 .scrollIntoViewIfNeeded();
  64  | 
  65  |             await healedLocator.click({
  66  |                 timeout: 3000,
  67  |             });
  68  |             console.log(
  69  |                 "🤖 AI healed selector:",
  70  |                 healedSelector
  71  |             );
  72  | 
  73  |             return healedSelector;
  74  | 
  75  |         }
  76  | 
  77  |         throw new Error(
  78  |             `Self-healing failed for selector: ${selector}`
  79  |         );
  80  | 
  81  |     }
  82  | }
  83  | 
  84  | 
  85  | 
  86  | export async function safeExpectVisible(
  87  |     page: Page,
  88  |     selector: string
  89  | ): Promise<string> {
  90  | 
  91  |     try {
  92  | 
  93  |         const locator =
  94  |             page.locator(
  95  |                 selector
  96  |             ).first();
  97  | 
  98  |         await expect(
  99  |             locator
  100 |         ).toBeVisible({
  101 |             timeout: 3000,
  102 |         });
  103 | 
  104 |         return selector;
  105 | 
  106 |     } catch (error) {
  107 | 
  108 |         console.log(
  109 |             "⚠️ Assertion selector failed:",
  110 |             selector
  111 |         );
  112 | 
  113 |         const healedSelector =
  114 |             await findBestSelector(
  115 |                 page,
  116 |                 selector
  117 |             );
  118 | 
  119 |         if (healedSelector) {
  120 | 
  121 |             const healedLocator =
  122 |                 page.locator(
  123 |                     healedSelector
  124 |                 ).first();
  125 | 
  126 |             await expect(
  127 |                 healedLocator
> 128 |             ).toBeVisible({
      |               ^ Error: expect(locator).toBeVisible() failed
  129 |                 timeout: 3000,
  130 |             });
  131 | 
  132 |             console.log(
  133 |                 "🤖 AI healed assertion:",
  134 |                 healedSelector
  135 |             );
  136 | 
  137 |             return healedSelector;
  138 | 
  139 |         }
  140 | 
  141 |         throw new Error(
  142 |             `Assertion healing failed for selector: ${selector}`
  143 |         );
  144 | 
  145 |     }
  146 | }
```