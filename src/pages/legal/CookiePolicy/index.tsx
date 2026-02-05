import Layout from "../../../components/Layout";

export default function CookiePolicy() {
    return (
        <Layout>
            <div className="h-full w-full bg-base-100 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Cookie Policy</h1>
                    <p className="text-base-content/60 font-medium mb-8">
                        Last Updated: January 28, 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Introduction</h2>
                        <p className="mb-4 text-base-content/80">
                            This Cookie Policy explains how <strong>APISpider</strong> ("we," "us," or "our") uses cookies and similar tracking technologies when you use our API client application and services (the "Service"). This policy should be read in conjunction with our Privacy Policy and Terms of Service.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            By using APISpider, you consent to the use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should adjust your browser settings accordingly or refrain from using our Service.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">What Are Cookies?</h2>
                        <p className="mb-4 text-base-content/80">
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website or use an application. They are widely used to make websites and applications work more efficiently and provide a better user experience.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">Types of Cookies</h3>
                        <p className="mb-4 text-base-content/80">Cookies can be classified in several ways:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>By Duration</strong>: Session Cookies (temporary) and Persistent Cookies (remain for a set period)</li>
                            <li><strong>By Origin</strong>: First-Party Cookies (set directly by us) and Third-Party Cookies (set by external services; we do not currently use these)</li>
                            <li><strong>By Purpose</strong>: Essential, Performance, Functionality, and Analytics cookies</li>
                        </ul>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">How We Use Cookies</h2>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">1. Essential Cookies</h3>
                        <p className="mb-4 text-base-content/80">
                            These cookies are necessary for the Service to function properly, enabling authentication, session management, security, and load balancing.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">2. Functionality Cookies</h3>
                        <p className="mb-4 text-base-content/80">
                            These cookies allow the Service to remember your preferences (theme, layout, sidebar state) to provide a more personalized experience.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">3. Performance and Analytics Cookies</h3>
                        <p className="mb-4 text-base-content/80">
                            These help us understand how users interact with the Service, allowing us to improve performance and user experience through anonymized aggregation.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Third-Party Cookies</h2>
                        <p className="mb-4 text-base-content/80">
                            Currently, APISpider does not use third-party cookies. We do not share your data with third-party analytics services or advertising networks that might set cookies on your device.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Similar Technologies</h2>
                        <p className="mb-4 text-base-content/80">We also use other storage technologies:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Local Storage</strong>: To cache data, store temporary working data, and save your work-in-progress.</li>
                            <li><strong>Session Storage</strong>: To maintain state during your current session.</li>
                            <li><strong>IndexedDB</strong>: For larger amounts of local data like request history.</li>
                        </ul>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Managing Cookies</h2>
                        <p className="mb-4 text-base-content/80">
                            You can control cookies through your browser settings. Most browsers allow you to view, delete, or block cookies. For instructions, check your specific browser's privacy settings.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            <strong>Note</strong>: Disabling essential cookies will prevent the Service from functioning. Disabling functionality cookies may result in the loss of personalized settings.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Updates to This Cookie Policy</h2>
                        <p className="mb-4 text-base-content/80">
                            We may update this policy periodically to reflect changes in technology or legal requirements. We encourage you to review it regularly.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Contact Us</h2>
                        <p className="mb-4 text-base-content/80">
                            If you have any questions about our use of cookies, please contact us at:
                        </p>
                        <p className="mb-4 text-base-content/80">
                            <strong>APISpider</strong><br />
                            Email: <a href="mailto:support@apispider.com" className="link link-primary">support@apispider.com</a>
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10 text-center font-bold">
                        <p>By using APISpider, you acknowledge that you have read and understood this Cookie Policy and consent to our use of cookies.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
