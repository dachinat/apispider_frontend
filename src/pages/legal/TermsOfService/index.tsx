import Layout from "../../../components/Layout";

export default function TermsOfService() {
    return (
        <Layout>
            <div className="h-full w-full bg-base-100 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Terms of Service</h1>
                    <p className="text-base-content/60 font-medium mb-8">
                        Last Updated: January 28, 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">1. Acceptance of Terms</h2>
                        <p className="mb-4 text-base-content/80">
                            Welcome to <strong>APISpider</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and APISpider ("we," "us," or "our") governing your access to and use of the APISpider application, website, and services (collectively, the "Service").
                        </p>
                        <p className="mb-4 text-base-content/80">
                            By creating an account, accessing, or using APISpider, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">2. Description of Service</h2>
                        <p className="mb-4 text-base-content/80">
                            APISpider is a lightweight API client designed for developers to test, debug, and document REST APIs. Our Service includes, but is not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>API request testing and debugging tools</li>
                            <li>Request history tracking</li>
                            <li>Collections management</li>
                            <li>Environment variables</li>
                            <li>Mock servers</li>
                            <li>API documentation generation</li>
                            <li>Related developer tools and features</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">3. Eligibility</h2>
                        <p className="mb-4 text-base-content/80">
                            You must be at least 18 years of age to use APISpider. By using the Service, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>You are at least 18 years old</li>
                            <li>You have the legal capacity to enter into these Terms</li>
                            <li>You will comply with all applicable laws and regulations</li>
                            <li>All information you provide is accurate and current</li>
                        </ul>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">4. Account Registration and Security</h2>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">4.1 Account Creation</h3>
                        <p className="mb-4 text-base-content/80">
                            To use APISpider, you must create an account by providing:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Your name</li>
                            <li>A valid email address</li>
                            <li>Any other information we may require</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">4.2 Account Security</h3>
                        <p className="mb-4 text-base-content/80">
                            You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use of your account</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Share your account credentials with others</li>
                            <li>Allow others to access your account</li>
                            <li>Create multiple accounts for fraudulent purposes</li>
                        </ul>
                        <p className="mb-4 text-base-content/80">
                            We are not liable for any loss or damage arising from your failure to protect your account credentials.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">5. Acceptable Use Policy</h2>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">5.1 Permitted Use</h3>
                        <p className="mb-4 text-base-content/80">
                            You may use APISpider only for lawful purposes and in accordance with these Terms. You agree to use the Service in a professional and ethical manner consistent with its intended purpose as a developer tool.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">5.2 Prohibited Activities</h3>
                        <p className="mb-4 text-base-content/80">
                            You agree NOT to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li><strong>Violate Laws</strong>: Use the Service in any way that violates applicable local, national, or international law or regulation</li>
                            <li><strong>Infringe Rights</strong>: Infringe upon the intellectual property rights, privacy rights, or other rights of any third party</li>
                            <li><strong>Abuse the Service</strong>: Engage in activity that could disable, overburden, or impair the Service; use automated systems (bots, scripts) to access the Service excessively; attempt unauthorized access</li>
                            <li><strong>Malicious Activity</strong>: Transmit viruses, malware; attack or probe third-party systems without authorization; engage in DDoS or similar network attacks</li>
                            <li><strong>Misuse API Testing</strong>: Use APISpider to test or attack APIs without proper authorization from the API owner</li>
                            <li><strong>Reverse Engineer</strong>: Decompile, disassemble, or attempt to discover the source code of the Service</li>
                            <li><strong>Resell</strong>: Redistribute or provide access to the Service to third parties without consent</li>
                            <li><strong>Impersonate</strong>: Falsely state or misrepresent your affiliation with any person or entity</li>
                        </ul>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">5.3 API Testing Ethics</h3>
                        <p className="mb-4 text-base-content/80">
                            When using APISpider to test APIs, you agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content/80 marker:text-primary">
                            <li>Only test APIs that you own or have explicit permission to test</li>
                            <li>Respect rate limits and terms of service of third-party APIs</li>
                            <li>Not use the Service to conduct unauthorized penetration testing or security assessments</li>
                        </ul>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">6. Intellectual Property Rights</h2>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">6.1 Our Rights</h3>
                        <p className="mb-4 text-base-content/80">
                            The Service and its entire contents, features, and functionality are owned by APISpider and are protected by copyright, trademark, and other intellectual property laws.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">6.2 Your Rights</h3>
                        <p className="mb-4 text-base-content/80">
                            You retain all rights to the data you create, store, or transmit through the Service, including API requests, collections, environment variables, and documentation.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            By using the Service, you grant us a limited, non-exclusive, royalty-free license to host, store, and process your data solely for the purpose of providing the Service to you.
                        </p>

                        <h3 className="text-lg font-bold mt-6 mb-2 text-base-content">6.3 Feedback</h3>
                        <p className="mb-4 text-base-content/80">
                            If you provide us with any feedback, you grant us an unlimited, irrevocable, perpetual, royalty-free license to use such Feedback for any purpose without compensation.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">7. User Content and Data</h2>
                        <p className="mb-4 text-base-content/80">
                            You are solely responsible for all data, content, and materials you upload, store, or transmit through the Service, and for ensuring you have all necessary rights and permissions.
                        </p>
                        <p className="mb-4 text-base-content/80">
                            We reserve the right to monitor or remove any content that violates these Terms or is otherwise objectionable.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">8. Privacy and Data Protection</h2>
                        <p className="mb-4 text-base-content/80">
                            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">9. Service Availability and Modifications</h2>
                        <p className="mb-4 text-base-content/80">
                            While we strive for reliability, we do not guarantee that the Service will be uninterrupted or error-free. We reserve the right to modify or discontinue the Service at any time.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">10. Termination</h2>
                        <p className="mb-4 text-base-content/80">
                            You may terminate your account at any time. We also reserve the right to suspend or terminate your access for any reason, including breach of these Terms.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">11. Disclaimers</h2>
                        <p className="mb-4 text-base-content/80">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. YOU ASSUME ALL RISK FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">12. Limitation of Liability</h2>
                        <p className="mb-4 text-base-content/80">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, APISPIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">13. Indemnification</h2>
                        <p className="mb-4 text-base-content/80">
                            You agree to defend and indemnify APISpider from any claims or damages arising from your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">14. Third-Party Services and Links</h2>
                        <p className="mb-4 text-base-content/80">
                            We are not responsible for the content or practices of any third-party websites or services linked from APISpider.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">15. Export Compliance</h2>
                        <p className="mb-4 text-base-content/80">
                            You agree to comply with all applicable export and import control laws and regulations.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">16. Dispute Resolution</h2>
                        <p className="mb-4 text-base-content/80">
                            Any disputes shall be governed by the laws of our operating jurisdiction and resolved through binding arbitration if informal resolution fails.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">17. General Provisions</h2>
                        <p className="mb-4 text-base-content/80">
                            These Terms constitute the entire agreement between you and APISpider. If any provision is found invalid, the rest remain in effect.
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-base-content">18. Contact Information</h2>
                        <p className="mb-4 text-base-content/80">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="mb-4 text-base-content/80">
                            <strong>APISpider</strong><br />
                            Email: <a href="mailto:support@apispider.com" className="link link-primary">support@apispider.com</a>
                        </p>
                    </section>

                    <div className="divider my-8"></div>

                    <section className="mb-10 text-center font-bold">
                        <p>By using APISpider, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
