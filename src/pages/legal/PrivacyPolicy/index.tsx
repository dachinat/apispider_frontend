import Layout from "../../../components/Layout";

export default function PrivacyPolicy() {
    return (
        <Layout>
            <div className="h-full w-full bg-base-100 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Privacy Policy</h1>
                    <p className="text-base-content/60 font-medium mb-8">
                        Last Updated: January 28, 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Introduction</h2>
                        <p className="mb-4 text-base-content/80">
                            Welcome to <strong>APISpider</strong> ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our API client application and services.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            APISpider is a lightweight API client designed for developers to test, debug, and document REST APIs with ease.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            By using APISpider, you agree to the collection and use of information in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Information We Collect</h2>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">Personal Information</h3>
                        <p className="mb-4 text-base-content/80">
                            When you create an account with APISpider, we collect the following personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Name</strong>: Your full name or username</li>
                            <li><strong>Email Address</strong>: Used for account creation, authentication, and service-related communications</li>
                        </ul>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">Usage Data</h3>
                        <p className="mb-4 text-base-content/80">
                            We automatically collect certain information when you use APISpider, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Request history and API testing data</li>
                            <li>Collections and environment variables you create</li>
                            <li>Mock server configurations</li>
                            <li>API documentation you generate</li>
                            <li>Application usage patterns and feature interactions</li>
                            <li>Technical information such as browser type, operating system, and IP address</li>
                            <li>Log data including access times and pages viewed</li>
                        </ul>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">Cookies and Tracking Technologies</h3>
                        <p className="mb-4 text-base-content/80">
                            We use cookies and similar tracking technologies to enhance your experience and collect usage data. Cookies are small data files stored on your device that help us:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Maintain your login session</li>
                            <li>Remember your preferences</li>
                            <li>Analyze usage patterns</li>
                            <li>Improve our service performance</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            You can control cookie settings through your browser preferences. However, disabling cookies may limit some functionality of APISpider.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">How We Use Your Information</h2>
                        <p className="mb-4 text-base-content/80">
                            We use the collected information solely for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Service Provision</strong>: To create and manage your account, provide access to APISpider features, and deliver the core functionality of our API client</li>
                            <li><strong>Service Improvement</strong>: To understand how users interact with APISpider, identify bugs, and enhance features and performance</li>
                            <li><strong>Communication</strong>: To send you service-related notifications, updates, and respond to your inquiries</li>
                            <li><strong>Security</strong>: To protect against unauthorized access, maintain data accuracy, and ensure appropriate use of our services</li>
                            <li><strong>Analytics</strong>: To analyze usage trends and optimize the user experience</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            We do not use your information for marketing purposes, advertising, or any other purposes beyond service provision and improvement.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Data Sharing and Disclosure</h2>
                        <p className="mb-4 text-base-content/80">
                            We respect your privacy and <strong>do not sell, trade, or rent your personal information to third parties</strong>.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            We do not share your data with third-party service providers, analytics companies, payment processors, or any other external parties, except in the following limited circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Legal Obligations</strong>: We may disclose your information if required by law, court order, or governmental regulation</li>
                            <li><strong>Protection of Rights</strong>: To protect our rights, property, or safety, or that of our users or the public</li>
                            <li><strong>Business Transfers</strong>: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity</li>
                        </ul>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Data Retention</h2>
                        <p className="mb-4 text-base-content/80">
                            We retain your personal information for as long as your account is active and registered with APISpider. Your data, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Account information (name and email)</li>
                            <li>Request history</li>
                            <li>Collections and environment variables</li>
                            <li>Mock server configurations</li>
                            <li>API documentation</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            ...will be stored and maintained while your account remains registered.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            If you wish to delete your account and associated data, please contact us at <a href="mailto:support@apispider.com" className="link link-primary">support@apispider.com</a>. Upon account deletion, we will remove your personal information from our active databases within a reasonable timeframe, except where we are required to retain certain information for legal or legitimate business purposes.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Data Security</h2>
                        <p className="mb-4 text-base-content/80">
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Regular security assessments</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Secure server infrastructure</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            However, please note that no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Your Rights and Choices</h2>
                        <p className="mb-4 text-base-content/80">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Access</strong>: Request access to the personal information we hold about you</li>
                            <li><strong>Correction</strong>: Request correction of inaccurate or incomplete information</li>
                            <li><strong>Deletion</strong>: Request deletion of your personal information</li>
                            <li><strong>Data Portability</strong>: Request a copy of your data in a portable format</li>
                            <li><strong>Objection</strong>: Object to certain processing of your personal information</li>
                            <li><strong>Withdrawal of Consent</strong>: Withdraw consent where processing is based on consent</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            To exercise any of these rights, please contact us at <a href="mailto:support@apispider.com" className="link link-primary">support@apispider.com</a>.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Cookies Management</h2>
                        <p className="mb-4 text-base-content/80">
                            You can manage your cookie preferences through your browser settings. Most browsers allow you to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>View what cookies are stored</li>
                            <li>Delete cookies</li>
                            <li>Block cookies from specific sites</li>
                            <li>Block all cookies</li>
                            <li>Delete all cookies when you close your browser</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            Please note that blocking or deleting cookies may impact your ability to use certain features of APISpider.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Children's Privacy</h2>
                        <p className="mb-4 text-base-content/80">
                            APISpider is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Changes to This Privacy Policy</h2>
                        <p className="mb-4 text-base-content/80">
                            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Posting the updated Privacy Policy on our website</li>
                            <li>Updating the "Last Updated" date at the top of this policy</li>
                            <li>Sending you an email notification (for significant changes)</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Contact Us</h2>
                        <p className="mb-4 text-base-content/80">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <p className="mb-4 text-base-content/80">
                            <strong>APISpider</strong><br />
                            Email: <a href="mailto:support@apispider.com" className="link link-primary">support@apispider.com</a>
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Compliance</h2>
                        <p className="mb-4 text-base-content/80">
                            We are committed to complying with applicable data protection laws and regulations. We recognize and respect the privacy rights of users from different jurisdictions, including those protected under GDPR (European Union) and other international privacy frameworks.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">Your Consent</h2>
                        <p className="mb-4 text-base-content/80">
                            By using APISpider, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                        </p>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
