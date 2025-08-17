import { Metadata } from 'next'
import { Card, CardContent } from '~/components/ui/card'

export const metadata: Metadata = {
    title: 'Privacy Policy - skowt.cc',
    description: 'Privacy Policy for skowt.cc',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <Card>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6">
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                            <p className="text-muted-foreground mb-3">
                                At skowt.cc, we take your privacy seriously. This Privacy Policy explains how we
                                collect, use, and protect your personal information. We are committed to GDPR compliance
                                and maintaining the highest standards of data protection.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                            <p className="text-muted-foreground mb-3">
                                We only collect necessary information to provide our service:
                            </p>

                            <h3 className="text-lg font-medium mt-4 mb-2">Account Information (via Discord OAuth)</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Discord username and ID</li>
                                <li>Discord email address</li>
                                <li>Discord avatar (profile picture)</li>
                            </ul>

                            <h3 className="text-lg font-medium mt-4 mb-2">Technical Information</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>IP address (for session management and security)</li>
                                <li>Browser type and version</li>
                                <li>Device information</li>
                                <li>Session cookies (essential for authentication)</li>
                            </ul>

                            <h3 className="text-lg font-medium mt-4 mb-2">Usage Data</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Assets you upload, download, or save</li>
                                <li>Search queries within the platform</li>
                                <li>Basic interaction data (no intrusive analytics)</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-3">We use your information solely to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Provide and maintain your account</li>
                                <li>Enable you to upload and download assets</li>
                                <li>Manage your saved assets and preferences</li>
                                <li>Ensure platform security and prevent abuse</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">4. What We DON'T Do</h2>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>We do NOT sell your personal data</li>
                                <li>We do NOT use third-party analytics services</li>
                                <li>We do NOT use third-party cookies</li>
                                <li>We do NOT share your data with advertisers</li>
                                <li>We do NOT track you across other websites</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">5. Data Storage and Security</h2>
                            <p className="text-muted-foreground mb-3">
                                Your data is stored securely using industry-standard encryption. We implement
                                appropriate technical and organizational measures to protect your personal information
                                against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>All data transmissions are encrypted using HTTPS</li>
                                <li>Passwords are never stored (we use Discord OAuth)</li>
                                <li>Database access is restricted and monitored</li>
                                <li>Regular security audits are performed</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
                            <p className="text-muted-foreground mb-3">
                                We only use essential first-party cookies required for authentication and session
                                management. These cookies are necessary for the website to function and cannot be
                                disabled.
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>
                                    <strong>Session cookies:</strong> To keep you logged in
                                </li>
                                <li>
                                    <strong>Preference cookies:</strong> To remember your settings (theme, layout)
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                We do NOT use any third-party cookies or tracking cookies.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">7. Your Rights (GDPR Compliance)</h2>
                            <p className="text-muted-foreground mb-3">Under GDPR, you have the following rights:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>
                                    <strong>Right to Access:</strong> Request a copy of your personal data
                                </li>
                                <li>
                                    <strong>Right to Rectification:</strong> Request correction of inaccurate data
                                </li>
                                <li>
                                    <strong>Right to Erasure:</strong> Request deletion of your account and data
                                </li>
                                <li>
                                    <strong>Right to Data Portability:</strong> Receive your data in a portable format
                                </li>
                                <li>
                                    <strong>Right to Object:</strong> Object to certain types of processing
                                </li>
                                <li>
                                    <strong>Right to Restrict Processing:</strong> Request limited processing of your
                                    data
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                To exercise any of these rights, please contact us through the information in our
                                footer.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
                            <p className="text-muted-foreground mb-3">
                                We retain your personal data only as long as necessary to provide our services:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Account data is kept while your account is active</li>
                                <li>Uploaded assets remain until you delete them</li>
                                <li>IP logs are retained for 30 days for security purposes</li>
                                <li>Deleted accounts are purged within 30 days</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">9. Third-Party Services</h2>
                            <p className="text-muted-foreground mb-3">We use minimal third-party services:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>
                                    <strong>Discord OAuth:</strong> For authentication only
                                </li>
                                <li>
                                    <strong>Cloudflare:</strong> For DDoS protection and CDN (no user tracking)
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                These services are selected for their strong privacy practices and GDPR compliance.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
                            <p className="text-muted-foreground mb-3">
                                Our Service is not directed to individuals under 13 years of age. We do not knowingly
                                collect personal information from children under 13. If you become aware that a child
                                has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">11. International Data Transfers</h2>
                            <p className="text-muted-foreground mb-3">
                                Your data may be processed in countries other than your own. We ensure that any
                                international transfers comply with GDPR requirements and that your data receives the
                                same level of protection.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">12. Changes to This Policy</h2>
                            <p className="text-muted-foreground mb-3">
                                We may update this Privacy Policy from time to time. We will notify you of any
                                significant changes by posting a notice on our website. Your continued use of the
                                Service after changes indicates acceptance.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">13. Data Breach Notification</h2>
                            <p className="text-muted-foreground mb-3">
                                In the unlikely event of a data breach, we will notify affected users within 72 hours in
                                accordance with GDPR requirements. Notifications will be sent via email and posted on
                                our website.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
                            <p className="text-muted-foreground mb-3">
                                For privacy-related questions, data requests, or concerns, please contact us:
                            </p>
                            <p className="text-muted-foreground">
                                Company information and contact details can be found in our website footer.
                            </p>
                        </section>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground pb-6">
                    <p>We are committed to protecting your privacy and ensuring your data is handled responsibly.</p>
                </div>
            </div>
        </div>
    )
}
