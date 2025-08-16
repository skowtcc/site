import { Metadata } from 'next'
import { HomeIcon } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export const metadata: Metadata = {
    title: 'Terms of Service - skowt.cc',
    description: 'Terms of Service for skowt.cc asset platform',
}

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">
                                <HomeIcon className="h-4 w-4" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Terms of Service</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Terms of Service</h1>
                    <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <Card>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6">
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground mb-3">
                                By accessing and using skowt.cc ("the Service"), you agree to be bound by these Terms of Service. 
                                If you do not agree to these terms, please do not use our Service.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                            <p className="text-muted-foreground mb-3">
                                skowt.cc provides a platform for sharing and downloading game assets and modifications. 
                                Users can upload, browse, and download content shared by the community.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>You must authenticate through Discord to create an account</li>
                                <li>You are responsible for maintaining the security of your account</li>
                                <li>You must provide accurate and current information</li>
                                <li>You are responsible for all activities under your account</li>
                                <li>You must notify us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
                            <p className="text-muted-foreground mb-3">By uploading content to skowt.cc, you:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Grant us a non-exclusive, worldwide, royalty-free license to host and distribute your content</li>
                                <li>Warrant that you have the right to upload and share the content</li>
                                <li>Agree that your content does not violate any third-party rights</li>
                                <li>Understand that content may be removed if it violates our policies</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">5. Prohibited Content and Conduct</h2>
                            <p className="text-muted-foreground mb-3">You may not upload or share:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Content that infringes on intellectual property rights</li>
                                <li>Malicious software, viruses, or harmful code</li>
                                <li>Illegal content or content that promotes illegal activities</li>
                                <li>Explicit adult content not properly marked as suggestive</li>
                                <li>Content that harasses, threatens, or harms others</li>
                                <li>Spam or misleading content</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                            <p className="text-muted-foreground mb-3">
                                All content uploaded remains the property of the original creators. 
                                skowt.cc does not claim ownership of user-uploaded content. 
                                However, we respect the intellectual property rights of game developers and will respond to valid takedown requests.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">7. Privacy and Data Protection</h2>
                            <p className="text-muted-foreground mb-3">
                                Your use of our Service is also governed by our Privacy Policy. 
                                We are committed to protecting your privacy and complying with GDPR and other applicable data protection laws.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">8. Disclaimers and Limitations of Liability</h2>
                            <p className="text-muted-foreground mb-3">
                                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. 
                                We do not guarantee the accuracy, completeness, or usefulness of any content. 
                                We are not liable for any damages arising from your use of the Service or content downloaded from it.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">9. Indemnification</h2>
                            <p className="text-muted-foreground mb-3">
                                You agree to indemnify and hold harmless skowt.cc and its operators from any claims, 
                                damages, or expenses arising from your use of the Service or violation of these Terms.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">10. Modifications to Terms</h2>
                            <p className="text-muted-foreground mb-3">
                                We reserve the right to modify these Terms at any time. 
                                Continued use of the Service after changes constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
                            <p className="text-muted-foreground mb-3">
                                We may terminate or suspend your account at any time for violation of these Terms. 
                                You may also delete your account at any time through the account settings.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
                            <p className="text-muted-foreground mb-3">
                                These Terms are governed by the laws of the jurisdiction where our company is registered. 
                                Any disputes shall be resolved in the courts of that jurisdiction.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
                            <p className="text-muted-foreground">
                                For questions about these Terms, please contact us through the information provided in our website footer.
                            </p>
                        </section>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground pb-6">
                    <p>By using skowt.cc, you acknowledge that you have read and agree to these Terms of Service.</p>
                </div>
            </div>
        </div>
    )
}